<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
</script>

<template>
  <main>
    <h1>Vue 3 + TypeScript</h1>
    <p>一个用于学习的极简项目</p>
    <el-button type="primary" @click="count++">Element Plus count is {{ count }}</el-button>
  </main>
</template>
