<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()
const router = useRouter()

const firstName = auth.user?.name?.split(' ')[0] || 'User'

const goToAi = () => {
  router.push({ name: 'ai-assistant' })
}
</script>

<template>
  <div class="min-h-full bg-[#f8f9fc] p-6 lg:p-10 font-sans">
    
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          {{ new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}
        </p>
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Hello, {{ firstName }}
        </h1>
        <p class="text-3xl md:text-4xl font-medium text-teal-400 tracking-tight mt-1">
          How can I help you today?
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="goToAi"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:scale-105 transition-all"
        >
          <SparklesIcon class="h-5 w-5" />
          Ask AI
        </button>
        <button class="px-5 py-3 bg-white text-slate-700 rounded-full font-bold shadow-sm hover:shadow transition-shadow text-sm">
          Get tasks updates
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-7 space-y-8">
        
        <div class="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-bold text-slate-900 inline-flex items-center gap-3">
              <ClipboardDocumentListIcon class="h-6 w-6 text-indigo-500" />
              My Tasks
            </h3>
            <div class="flex gap-2">
              <button class="p-1 text-slate-400 hover:text-slate-600"><PlusIcon class="h-5 w-5" /></button>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">IN PROGRESS</span>
              <span class="text-xs font-bold text-slate-400">2 tasks</span>
            </div>

            <div v-for="(task, idx) in [
              { title: 'Review Leave Request #142', priority: 'High', time: 'Today', color: 'text-rose-500' },
              { title: 'Approval Overtime IT Dept', priority: 'Low', time: '3 days left', color: 'text-slate-500' }
            ]" :key="idx" 
            class="group flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="h-4 w-4 rounded-full border-2 border-slate-300 group-hover:border-indigo-400 transition-colors"></div>
                <p class="text-sm font-semibold text-slate-700">{{ task.title }}</p>
              </div>
              <div class="flex items-center gap-6">
                <span class="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">{{ task.priority }}</span>
                <span :class="['text-xs font-bold w-16 text-right', task.color]">{{ task.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8">
          <h3 class="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
            <CheckCircleIcon class="h-6 w-6 text-indigo-500" />
            My Goals
          </h3>
          <div class="space-y-6">
            <div class="flex items-center gap-6">
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">Profile Completeness</p>
                <p class="text-xs text-slate-400 mt-0.5">HR Requirement • Onboarding</p>
              </div>
              <div class="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-teal-400 rounded-full" style="width: 73%"></div>
              </div>
              <span class="text-xs font-bold text-slate-700 w-8 text-right">73%</span>
            </div>
             <div class="flex items-center gap-6">
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-800">Quarterly KPI Target</p>
                <p class="text-xs text-slate-400 mt-0.5">Engineering • Q2 2026</p>
              </div>
              <div class="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-amber-400 rounded-full" style="width: 45%"></div>
              </div>
              <span class="text-xs font-bold text-slate-700 w-8 text-right">45%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 space-y-8">
        
        <div class="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8">
          <h3 class="text-sm font-bold text-slate-900 mb-6 flex justify-between">
            Departments <span class="text-slate-400 font-normal">Recents </span>
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div class="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <div class="h-4 w-4 bg-purple-500 rounded-[4px] rotate-45"></div>
              </div>
              <p class="font-bold text-slate-800 text-sm">IT Dept</p>
              <p class="text-[10px] font-bold text-slate-400 mt-0.5">12 Members</p>
            </div>
            <div class="p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div class="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <div class="h-4 w-4 bg-teal-500 rounded-full"></div>
              </div>
              <p class="font-bold text-slate-800 text-sm">Human Resources</p>
              <p class="text-[10px] font-bold text-slate-400 mt-0.5">4 Members</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon class="h-5 w-5 text-indigo-500" />
              Calendar <span class="text-slate-400 font-normal ml-1">July</span>
            </h3>
            <div class="flex gap-2 text-slate-400">
              <ArrowRightIcon class="h-4 w-4 rotate-180 cursor-pointer hover:text-slate-700" />
              <ArrowRightIcon class="h-4 w-4 cursor-pointer hover:text-slate-700" />
            </div>
          </div>
          <div class="flex justify-between text-center mb-6">
            <div v-for="d in ['04', '05', '06', '07', '08']" :key="d" class="space-y-1.5 cursor-pointer">
              <span class="text-[10px] font-bold text-slate-400 block">{{ d === '04' ? 'Fri' : d === '05' ? 'Sat' : d === '06' ? 'Sun' : d === '07' ? 'Mon' : 'Tue' }}</span>
              <div :class="['h-10 w-10 flex items-center justify-center rounded-2xl text-sm font-bold transition-colors', d === '07' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-700 hover:bg-slate-100']">
                {{ d }}
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-slate-50 rounded-2xl">
            <p class="text-sm font-bold text-slate-800">Meeting with HR Manager</p>
            <p class="text-xs text-slate-500 mt-1">Today • 10:00 - 11:00 am</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>