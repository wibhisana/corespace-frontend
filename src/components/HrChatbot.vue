<script setup>
import { ref, nextTick, useTemplateRef } from 'vue'
import { aiApi } from '@/utils/api'

const messages = ref([])
const input = ref('')
const loading = ref(false)
const errorMessage = ref('')
const scrollerRef = useTemplateRef('scroller')

async function scrollToBottom() {
  await nextTick()
  const el = scrollerRef.value
  if (el) el.scrollTop = el.scrollHeight
}

function refLabel(ref, idx) {
  if (typeof ref === 'string') return ref
  return ref?.title || ref?.source || ref?.name || `ref ${idx + 1}`
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  errorMessage.value = ''
  loading.value = true
  await scrollToBottom()

  try {
    const { data } = await aiApi.post('/hr-chat', { question: text })
    messages.value.push({
      role: 'assistant',
      content: data.answer ?? '(no answer returned)',
      references: Array.isArray(data.references) ? data.references : [],
      status: data.status,
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
  <div class="flex h-full flex-col bg-gray-50">
    <!-- Messages -->
    <div ref="scroller" class="flex-1 overflow-y-auto px-4 py-6">
      <div class="mx-auto max-w-3xl space-y-4">
        <div
          v-if="messages.length === 0"
          class="text-center text-sm text-gray-400 py-12"
        >
          Ask anything about HR policies, leave balances, or company info.
        </div>

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap max-w-[80%]"
            :class="[
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : msg.isError
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-white text-gray-900 border border-gray-200',
            ]"
          >
            <p>{{ msg.content }}</p>
            <div
              v-if="msg.references?.length"
              class="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5"
            >
              <span
                v-for="(r, j) in msg.references"
                :key="j"
                class="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
              >
                {{ refLabel(r, j) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-start">
          <div class="rounded-2xl bg-white border border-gray-200 px-4 py-2.5 text-sm text-gray-500">
            <span class="inline-flex gap-1">
              <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
              <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
              <span class="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Composer -->
    <div class="border-t border-gray-200 bg-white px-4 py-3">
      <div class="mx-auto max-w-3xl">
        <p v-if="errorMessage" class="mb-2 text-xs text-rose-600">{{ errorMessage }}</p>
        <div class="flex items-end gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <textarea
            v-model="input"
            @keydown="handleKeydown"
            rows="1"
            placeholder="Type your question…"
            class="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 max-h-40"
          />
          <button
            @click="send"
            :disabled="loading || !input.trim()"
            class="rounded-md bg-indigo-600 text-white text-sm px-3 py-1.5 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p class="mt-1.5 text-[11px] text-gray-400">Press Enter to send, Shift+Enter for new line.</p>
      </div>
    </div>
  </div>
</template>
