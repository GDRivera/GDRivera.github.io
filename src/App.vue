<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const days = ref('90')
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')

const targetDate = dayjs().add(90, 'day')

const updateCountdown = () => {
  const now = dayjs()
  const diff = targetDate.diff(now)
  const duration = dayjs.duration(diff)

  days.value = Math.floor(duration.asDays()).toString().padStart(2, '0')
  hours.value = duration.hours().toString().padStart(2, '0')
  minutes.value = duration.minutes().toString().padStart(2, '0')
  seconds.value = duration.seconds().toString().padStart(2, '0')
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center font-mono">
    <div class="grid grid-cols-4 gap-4 text-center">
      <div>
        <div class="text-6xl font-bold">{{ days }}</div>
        <div class="text-slate-400 text-sm mt-2">DAYS</div>
      </div>
      <div>
        <div class="text-6xl font-bold">{{ hours }}</div>
        <div class="text-slate-400 text-sm mt-2">HOURS</div>
      </div>
      <div>
        <div class="text-6xl font-bold">{{ minutes }}</div>
        <div class="text-slate-400 text-sm mt-2">MINS</div>
      </div>
      <div>
        <div class="text-6xl font-bold">{{ seconds }}</div>
        <div class="text-slate-400 text-sm mt-2">SECS</div>
      </div>
    </div>
  </main>
</template>