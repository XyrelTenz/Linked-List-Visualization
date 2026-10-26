<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { sound } from '../utils/sound'
import {
  ListFilter,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
  Tv,
  Sparkles
} from 'lucide-vue-next'

const router = useRouter()
const deckStore = useDeckStore()
const showShortcutsModal = ref(false)

function toggleShortcuts() {
  showShortcutsModal.value = !showShortcutsModal.value
}

function goToQuiz() {
  sound.play('click')
  router.push('/quiz/1')
}
</script>

<template>
  <header class="w-full bg-[#ffffff] border-b-2 border-[#111111] sticky top-0 z-40 select-none shadow-[0_2px_0_#111111]">
    <!-- Top thin progress line -->
    <div class="w-full bg-[#111111]/10 h-1.5 relative overflow-hidden">
      <div
        class="h-full bg-[#ff3d81] transition-all duration-300 ease-out border-r border-[#111111]"
        :style="{ width: `${deckStore.progressPercent}%` }"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-3">
      <!-- Left: Logo & Subtitle on Desktop, OR the 4 Utility Buttons on Mobile -->
      <div class="flex items-center gap-1.5 sm:gap-2.5">
        <!-- Desktop Logo & Tag (>= sm) -->
        <div class="hidden sm:flex items-center gap-2.5">
          <div class="flex items-center justify-center w-8 h-8 bg-[#ffd23f] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-display text-sm font-black">
            LL
          </div>
          <div>
            <div class="font-display text-xs sm:text-sm tracking-tight leading-tight flex items-center gap-1.5">
              <span>LINKED LISTS</span>
              <span class="hidden md:inline-block px-1.5 py-0.2 bg-[#3ddc97] border border-[#111111] text-[10px] font-mono font-bold shadow-[1px_1px_0px_#111]">
                COMPLETE GUIDE
              </span>
            </div>
            <p class="text-[10px] font-mono text-neutral-600 hidden sm:block">
              Data Structures & Algorithms
            </p>
          </div>
        </div>

        <!-- Mobile Utility Buttons: On the LEFT (< sm) -->
        <div class="flex sm:hidden items-center gap-1.5">
          <!-- 1. Shortcuts / Help button -->
          <button
            type="button"
            class="brutal-btn h-8 w-8 bg-[#ffffff] text-[#111111] flex items-center justify-center border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            title="Keyboard Shortcuts"
            @click="toggleShortcuts"
          >
            <HelpCircle class="w-4 h-4" />
          </button>

          <!-- 2. Sound toggle -->
          <button
            type="button"
            class="brutal-btn h-8 w-8 flex items-center justify-center border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            :class="deckStore.soundEnabled ? 'bg-[#3ddc97]' : 'bg-[#e5e5e5] text-neutral-500'"
            :title="deckStore.soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'"
            @click="deckStore.toggleSound"
          >
            <component :is="deckStore.soundEnabled ? Volume2 : VolumeX" class="w-4 h-4" />
          </button>

          <!-- 3. Auto Play toggle -->
          <button
            type="button"
            class="brutal-btn h-8 px-2 flex items-center justify-center gap-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 transition-all"
            :class="[
              deckStore.isAutoPlaying
                ? 'bg-[#3ddc97] text-[#111111]'
                : 'bg-[#ffffff] text-neutral-600 hover:bg-[#fffdf5]'
            ]"
            :title="deckStore.isAutoPlaying ? 'Autoplay is ACTIVE (Click to turn OFF)' : 'Autoplay is OFF (Click to turn ON)'"
            @click="deckStore.toggleAutoPlay"
          >
            <span
              v-if="deckStore.isAutoPlaying"
              class="relative flex h-2 w-2"
            >
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3d81] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#ff3d81]"></span>
            </span>
            <span
              v-else
              class="w-2 h-2 rounded-full bg-neutral-400"
            ></span>

            <component
              :is="deckStore.isAutoPlaying ? PauseCircle : PlayCircle"
              class="w-4 h-4"
              :class="deckStore.isAutoPlaying ? 'text-black stroke-[2.5]' : 'text-neutral-500'"
            />

            <div class="font-mono font-black text-xs flex items-center gap-1">
              <span
                class="px-1 py-0.2 border border-black text-[10px]"
                :class="deckStore.isAutoPlaying ? 'bg-black text-[#3ddc97]' : 'bg-neutral-200 text-neutral-600'"
              >
                {{ deckStore.isAutoPlaying ? 'ON' : 'OFF' }}
              </span>
            </div>
          </button>

          <!-- 4. Presentation Mode (PPT) toggle -->
          <button
            type="button"
            class="brutal-btn h-8 w-8 bg-[#ffffff] hover:bg-[#ffd23f] text-[#111111] flex items-center justify-center border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            title="Presentation Slideshow Mode (F)"
            @click="deckStore.togglePresentationMode"
          >
            <Tv class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Center: Current Slide Label -->
      <div class="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#fdf9f0] border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
        <span class="w-2 h-2 rounded-full bg-[#ff3d81] border border-black animate-pulse"></span>
        <span class="font-mono text-xs font-bold text-[#111111]">
          SLIDE {{ String(deckStore.currentSlideNumber).padStart(2, '0') }}:
        </span>
        <span class="font-mono text-xs font-semibold text-neutral-700 max-w-[200px] truncate">
          {{ deckStore.currentSlide?.title || 'LINKED LISTS' }}
        </span>
      </div>

      <!-- Right: Desktop Controls & Slide Menu Drawer Button -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Desktop Utility Controls (hidden on sm, shown on sm+) -->
        <div class="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <!-- 1. Shortcuts / Help button -->
          <button
            type="button"
            class="brutal-btn h-8 md:w-auto p-1.5 md:px-2.5 bg-[#ffffff] text-[#111111] flex items-center justify-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            title="Keyboard Shortcuts"
            @click="toggleShortcuts"
          >
            <HelpCircle class="w-4 h-4" />
            <span class="hidden md:inline font-mono font-bold">KEYS</span>
          </button>

          <!-- 2. Sound toggle -->
          <button
            type="button"
            class="brutal-btn h-8 sm:w-auto p-1.5 sm:px-2.5 flex items-center justify-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            :class="deckStore.soundEnabled ? 'bg-[#3ddc97]' : 'bg-[#e5e5e5] text-neutral-500'"
            :title="deckStore.soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'"
            @click="deckStore.toggleSound"
          >
            <component :is="deckStore.soundEnabled ? Volume2 : VolumeX" class="w-4 h-4" />
            <span class="hidden sm:inline font-mono font-bold text-xs">{{ deckStore.soundEnabled ? 'FX ON' : 'FX OFF' }}</span>
          </button>

          <!-- 3. Auto Play toggle -->
          <button
            type="button"
            class="brutal-btn h-8 px-2 sm:px-2.5 flex items-center justify-center gap-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 transition-all"
            :class="[
              deckStore.isAutoPlaying
                ? 'bg-[#3ddc97] text-[#111111]'
                : 'bg-[#ffffff] text-neutral-600 hover:bg-[#fffdf5]'
            ]"
            :title="deckStore.isAutoPlaying ? 'Autoplay is ACTIVE (Click to turn OFF)' : 'Autoplay is OFF (Click to turn ON)'"
            @click="deckStore.toggleAutoPlay"
          >
            <span
              v-if="deckStore.isAutoPlaying"
              class="relative flex h-2 w-2"
            >
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3d81] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#ff3d81]"></span>
            </span>
            <span
              v-else
              class="w-2 h-2 rounded-full bg-neutral-400"
            ></span>

            <component
              :is="deckStore.isAutoPlaying ? PauseCircle : PlayCircle"
              class="w-4 h-4"
              :class="deckStore.isAutoPlaying ? 'text-black stroke-[2.5]' : 'text-neutral-500'"
            />

            <div class="font-mono font-black text-xs flex items-center gap-1">
              <span class="hidden sm:inline">AUTO</span>
              <span
                class="px-1 py-0.2 border border-black text-[10px]"
                :class="deckStore.isAutoPlaying ? 'bg-black text-[#3ddc97]' : 'bg-neutral-200 text-neutral-600'"
              >
                {{ deckStore.isAutoPlaying ? 'ON' : 'OFF' }}
              </span>
              <span
                v-if="deckStore.isAutoPlaying"
                class="hidden lg:inline text-[10px] text-black bg-white px-1 border border-black font-mono font-bold"
              >
                {{ deckStore.autoPlayCountdown }}s
              </span>
            </div>
          </button>

          <!-- 4. Presentation Mode (PPT) toggle -->
          <button
            type="button"
            class="brutal-btn h-8 md:w-auto p-1.5 md:px-2.5 bg-[#ffffff] hover:bg-[#ffd23f] text-[#111111] flex items-center justify-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0"
            title="Presentation Slideshow Mode (F)"
            @click="deckStore.togglePresentationMode"
          >
            <Tv class="w-4 h-4" />
            <span class="hidden md:inline font-mono font-bold text-xs">PPT</span>
          </button>

          <!-- Quiz Mode button -->
          <button
            type="button"
            class="brutal-btn h-8 bg-[#ff3d81] text-white px-2.5 text-xs items-center justify-center gap-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-bold shrink-0"
            title="Take Linked List Quiz (Q)"
            @click="goToQuiz"
          >
            <Sparkles class="w-3.5 h-3.5 fill-white" />
            <span class="font-mono">QUIZ</span>
          </button>
        </div>

        <!-- Slide Menu Drawer Button (Right on both mobile & desktop) -->
        <button
          type="button"
          class="brutal-btn h-8 bg-[#ffd23f] text-[#111111] px-2.5 sm:px-3 text-xs flex items-center justify-center gap-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-bold shrink-0"
          title="Open Menu (M)"
          @click="deckStore.toggleOverview"
        >
          <ListFilter class="w-4 h-4" />
          <span class="font-mono">MENU</span>
        </button>
      </div>
    </div>

    <!-- Keyboard Shortcuts Modal -->
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]"
      @click.self="showShortcutsModal = false"
    >
      <div class="bg-white border-4 border-[#111111] shadow-[8px_8px_0px_#111111] max-w-md w-full p-6 relative">
        <div class="flex items-center justify-between pb-3 border-b-2 border-[#111111] mb-4">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-[#ff3d81] border border-black inline-block"></span>
            <h3 class="font-display text-lg">KEYBOARD SHORTCUTS</h3>
          </div>
          <button
            type="button"
            class="brutal-btn bg-[#ff6b5e] p-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]"
            @click="showShortcutsModal = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 font-mono text-sm">
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">Next Slide</span>
            <div class="flex gap-1">
              <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">Right Arrow</kbd>
              <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">Space</kbd>
            </div>
          </div>
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">Previous Slide</span>
            <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">Left Arrow</kbd>
          </div>
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">Slide Overview / Index</span>
            <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">M / Esc</kbd>
          </div>
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">Toggle Fullscreen</span>
            <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">F</kbd>
          </div>
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">Toggle Quiz Mode</span>
            <kbd class="px-2 py-0.5 bg-[#ff3d81] text-white border border-black shadow-[1px_1px_0_#000] text-xs font-bold">Q</kbd>
          </div>
          <div class="flex items-center justify-between p-2 bg-[#fdf9f0] border-2 border-[#111111]">
            <span class="font-bold">First / Last Slide</span>
            <div class="flex gap-1">
              <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">Home</kbd>
              <kbd class="px-2 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-xs">End</kbd>
            </div>
          </div>
        </div>

        <div class="mt-5 text-center">
          <button
            type="button"
            class="brutal-btn bg-[#ffd23f] w-full py-2 font-mono font-bold text-sm border-2 border-[#111111] shadow-[3px_3px_0px_#111111]"
            @click="showShortcutsModal = false"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
