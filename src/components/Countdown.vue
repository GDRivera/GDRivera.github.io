<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const days = ref('90');
const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');
const animateSeconds = ref(false);

const targetDate = dayjs().add(90, 'day');

const updateCountdown = () => {
  const now = dayjs();
  const diff = targetDate.diff(now);
  const timeLeft = dayjs.duration(diff);

  days.value = Math.floor(timeLeft.asDays()).toString().padStart(2, '0');
  hours.value = timeLeft.hours().toString().padStart(2, '0');
  minutes.value = timeLeft.minutes().toString().padStart(2, '0');
  seconds.value = timeLeft.seconds().toString().padStart(2, '0');

  animateSeconds.value = true;
  setTimeout(() => {
    animateSeconds.value = false;
  }, 500);
};

let interval: number;

onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center text-white font-mono p-4">
    <div class="text-center">
      <div class="flex flex-wrap justify-center gap-2 sm:gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
        <div class="flex flex-col items-center">
          <span>{{ days }}</span>
          <span class="text-xs sm:text-sm text-gray-400 mt-2">DAYS</span>
        </div>
        <div class="text-gray-500 self-start mt-1">:</div>
        <div class="flex flex-col items-center">
          <span>{{ hours }}</span>
          <span class="text-xs sm:text-sm text-gray-400 mt-2">HOURS</span>
        </div>
        <div class="text-gray-500 self-start mt-1">:</div>
        <div class="flex flex-col items-center">
          <span>{{ minutes }}</span>
          <span class="text-xs sm:text-sm text-gray-400 mt-2">MINS</span>
        </div>
        <div class="text-gray-500 self-start mt-1">:</div>
        <div class="flex flex-col items-center">
          <span class="countdown-number" :class="{ 'update': animateSeconds }">{{ seconds }}</span>
          <span class="text-xs sm:text-sm text-gray-400 mt-2">SECS</span>
        </div>
      </div>
    </div>
  </div>
</template>