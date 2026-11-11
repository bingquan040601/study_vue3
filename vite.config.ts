import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import externalGlobals from 'rollup-plugin-external-globals'
import { compression } from 'vite-plugin-compression2'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { Plugin } from 'vite'

function acceptsBrotli(acceptEncoding: string | undefined) {
  return acceptEncoding?.split(',').some((part) => {
    const [encoding, ...params] = part.trim().toLowerCase().split(';')
    if (encoding !== 'br') return false

    const quality = params.find((param) => param.trim().startsWith('q='))
    return quality === undefined || Number(quality.split('=')[1]) > 0
  }) ?? false
}

// 仅用于本地 preview：让浏览器通过原始 JS/CSS 地址收到对应的 .br 内容
function brotliPreview(): Plugin {
  return {
    name: 'brotli-preview',
    configurePreviewServer(server) {
      const distDir = resolve(process.cwd(), 'dist')

      server.middlewares.use(async (req, res, next) => {
        if (
          !['GET', 'HEAD'].includes(req.method ?? '') ||
          !acceptsBrotli(req.headers['accept-encoding'])
        ) {
          return next()
        }

        try {
          const pathname = decodeURIComponent(
            new URL(req.url ?? '/', 'http://localhost').pathname,
          )
          if (!/\.(js|css)$/.test(pathname)) return next()

          const filePath = resolve(distDir, `.${pathname}`)
          if (!filePath.startsWith(`${distDir}${sep}`)) return next()

          const compressed = await readFile(`${filePath}.br`)
          res.statusCode = 200
          res.setHeader('Content-Encoding', 'br')
          res.setHeader('Content-Type', filePath.endsWith('.css')
            ? 'text/css; charset=utf-8'
            : 'text/javascript; charset=utf-8')
          res.setHeader('Content-Length', compressed.byteLength)
          res.setHeader('Vary', 'Accept-Encoding')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(req.method === 'HEAD' ? undefined : compressed)
        } catch {
          // 没有对应 .br 文件时，交给 Vite 返回原始资源
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    brotliPreview(),
    // 构建后在 dist/stats.html 生成产物体积分析报告
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    // 生成 .br 文件，部署时由服务器按客户端能力返回
    compression({
      algorithms: ['brotliCompress'],
      include: [/\.js$/, /\.css$/],
    }),
  ],
  build: {
    minify: 'esbuild',
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      // Vue 和 Element Plus 由 public/vendor 中的本地全局脚本提供
      external: ['vue', 'element-plus'],
      plugins: [
        externalGlobals({
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        }),
      ],
      output: {
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
