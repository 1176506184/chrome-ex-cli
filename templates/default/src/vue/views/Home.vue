<script setup lang="ts">

</script>

<template>
  <div class="w-[700px] h-[500px] bg-slate-900 overflow-hidden antialiased relative">

    <div class="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black"></div>

    <div class="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"></div>
    <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]"></div>

    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-10">

      <span
          class="px-3 py-1 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-md">
        Developer Tools
      </span>

      <h1 class="text-5xl font-black text-white mb-4 tracking-tight">
        ChromeEX
        <span class="text-blue-500">CLI</span>
      </h1>

      <p class="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
        欢迎使用现代化的插件开发利器。<br>
        代码已就绪，开始构建你的伟大想法。
      </p>

      <div class="mt-10 flex gap-4">
        <button
            class="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
          立即开始
        </button>
        <button
            class="px-10 py-3 bg-slate-800 text-slate-300 font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
          项目设置
        </button>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
  </div>
</template>

<style scoped>

</style>