<script setup>
import { ref } from 'vue'
import HrChatbot from '@/components/HrChatbot.vue'
import AppTextInput from '@/components/ui/AppTextInput.vue' // Wajib import
import { SparklesIcon, PaperClipIcon } from '@heroicons/vue/24/solid'
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const isChatStarted = ref(false)
const searchQuery = ref('')

const startChatWithPrompt = (prompt) => {
  searchQuery.value = prompt
  isChatStarted.value = true
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    isChatStarted.value = true
  }
}
</script>

<template>
  <div class="h-[calc(100vh-4rem)] relative flex flex-col bg-[#f8f9fc] font-sans">
    
    <div v-if="!isChatStarted" class="flex-1 flex flex-col items-center justify-center p-6 pb-32">
      
      <div class="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] mb-12">
        <SparklesIcon class="h-8 w-8 text-white" />
      </div>

      <div class="flex flex-wrap justify-center gap-6 max-w-4xl w-full">
        <button 
          v-for="prompt in [
            'What should I work on next?',
            'What are my urgent tasks?',
            'Check my leave balance'
          ]" 
          :key="prompt"
          @click="startChatWithPrompt(prompt)"
          class="w-full sm:w-64 min-h-[100px] p-6 bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left flex items-center group"
        >
          <p class="text-[15px] font-semibold text-indigo-900 leading-snug group-hover:text-indigo-600 transition-colors">
            {{ prompt }}
          </p>
        </button>
      </div>
    </div>

    <div v-if="!isChatStarted" class="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
      <div class="bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center p-2 ring-1 ring-black/5">
        
        <AppTextInput 
          v-model="searchQuery"
          placeholder="Ask or search for anything"
          :border="false"
          :focus-state="false"
          :left-icon="PaperClipIcon"
          size="md"
          class="flex-1 [&_.bg-surface-disabled]:bg-transparent"
          @keydown.enter="handleSearch"
        />
        
        <button 
          @click="handleSearch"
          :disabled="!searchQuery.trim()"
          class="h-10 w-10 shrink-0 ml-2 mr-1 flex items-center justify-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
          :class="searchQuery.trim() ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-400'"
        >
          <ArrowUpIcon class="h-5 w-5 stroke-2" />
        </button>
      </div>
    </div>

    <HrChatbot v-else class="flex-1 overflow-hidden" :initial-message="searchQuery" />

  </div>
</template>

<style scoped>
:deep(.border-0) {
  background-color: transparent !important;
}
</style>