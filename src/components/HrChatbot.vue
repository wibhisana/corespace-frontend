<script setup>
import { ref, nextTick, useTemplateRef, watch } from 'vue'
import {
  UserCircleIcon,
  SparklesIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'
import { aiApi } from '@/utils/aiApi'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const errorMessage = ref('')
const scrollerRef = useTemplateRef('scroller')
const textareaRef = useTemplateRef('textarea')

async function scrollToBottom() {
  await nextTick()
  const el = scrollerRef.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(input, () => {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
})

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  errorMessage.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const { data } = await aiApi.post('/chat', { message: text })
    messages.value.push({
      role: 'assistant',
      content: data.answer ?? data.message ?? '(no answer returned)',
    })
  } catch (err) {
    const message = err?.userMessage || 'Failed to reach the AI assistant.'
    errorMessage.value = message
    messages.value.push({
      role: 'assistant',
      content: message,
      isError: true,
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div class="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
        <SparklesIcon class="h-6 w-6" />
      </div>
      <div>
        <h4 class="font-bold text-slate-900">CoreSpace AI</h4>
        <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
      </div>
    </div>

    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-6">
       </div>

    <div class="p-6 bg-white border-t border-slate-100">
      <div class="max-w-4xl mx-auto flex items-end gap-3">
        <textarea
          v-model="inputQuery"
          rows="1"
          placeholder="Type your message..."
          class="flex-1 py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:outline-none resize-none"
        ></textarea>
        <button class="h-14 w-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <PaperAirplaneIcon class="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</template>
