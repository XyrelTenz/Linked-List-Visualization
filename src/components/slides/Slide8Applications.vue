<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import BrutalButton from '../common/BrutalButton.vue'
import { sound } from '../../utils/sound'
import {
  Music,
  Globe,
  Undo2,
  Redo2,
  Cpu,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCw,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-vue-next'

// App 1: Music Playlist (Circular)
const songs = ['Synthwave Sunset', 'Neon Cyberpunk', 'Lo-Fi Chill Hop', 'Pixel Odyssey']
const currentSongIndex = ref(0)
const isPlaying = ref(false)

function nextSong() {
  sound.play('step')
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.length
}

function prevSong() {
  sound.play('step')
  currentSongIndex.value = (currentSongIndex.value - 1 + songs.length) % songs.length
}

function togglePlay() {
  sound.play('click')
  isPlaying.value = !isPlaying.value
}

// App 2: Browser History (Doubly)
const history = ref<string[]>(['google.com', 'github.com', 'developer.mozilla.org'])
const historyIndex = ref<number>(2)
const newUrlInput = ref<string>('news.ycombinator.com')

function goBack() {
  if (historyIndex.value > 0) {
    sound.play('step')
    historyIndex.value--
  }
}

function goForward() {
  if (historyIndex.value < history.value.length - 1) {
    sound.play('step')
    historyIndex.value++
  }
}

function visitUrl() {
  if (!newUrlInput.value) return
  sound.play('click')
  // Truncate any forward history and append new node
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(newUrlInput.value)
  historyIndex.value = history.value.length - 1
  newUrlInput.value = ''
}

// App 3: Undo / Redo (Linked List)
const editorText = ref<string>('Hello World!')
const undoStack = ref<string[]>(['Hello', 'Hello World', 'Hello World!'])
const undoPointer = ref<number>(2)

function typeText(word: string) {
  sound.play('add')
  undoStack.value = undoStack.value.slice(0, undoPointer.value + 1)
  undoStack.value.push(editorText.value + ' ' + word)
  undoPointer.value = undoStack.value.length - 1
  editorText.value = undoStack.value[undoPointer.value] ?? ''
}

function handleUndo() {
  if (undoPointer.value > 0) {
    sound.play('remove')
    undoPointer.value--
    editorText.value = undoStack.value[undoPointer.value] ?? ''
  }
}

function handleRedo() {
  if (undoPointer.value < undoStack.value.length - 1) {
    sound.play('add')
    undoPointer.value++
    editorText.value = undoStack.value[undoPointer.value] ?? ''
  }
}

// App 4: OS Freelist
interface MemoryBlock {
  id: string
  size: number
  status: 'free' | 'used'
}

const memoryBlocks = ref<MemoryBlock[]>([
  { id: 'b1', size: 64, status: 'free' },
  { id: 'b2', size: 128, status: 'used' },
  { id: 'b3', size: 256, status: 'free' },
  { id: 'b4', size: 64, status: 'used' }
])

function allocateBlock() {
  sound.play('click')
  const freeBlock = memoryBlocks.value.find(b => b.status === 'free')
  if (freeBlock) {
    freeBlock.status = 'used'
    sound.play('add')
  }
}

function freeBlock() {
  sound.play('click')
  const usedBlock = memoryBlocks.value.find(b => b.status === 'used')
  if (usedBlock) {
    usedBlock.status = 'free'
    sound.play('remove')
  }
}
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="yellow" size="sm">TOPIC VIII</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">SOFTWARE ENGINEERING IN THE WILD</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          VIII. APPLICATIONS OF LINKED LISTS
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>4 Practical Engineering Case Studies</p>
        <p class="text-[10px] text-neutral-500">Interactive live mini-demonstrations</p>
      </div>
    </div>

    <!-- 4 Interactive Real-World Demos Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
      <!-- Demo 1: Music Playlist (Circular Singly) -->
      <div class="border-2 border-[#111111] bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_#111111] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-black">
            <div class="flex items-center gap-1.5">
              <Music class="w-4 h-4 text-[#ff3d81]" />
              <h3 class="font-display text-xs sm:text-sm uppercase">1. Music Playlists</h3>
            </div>
            <BrutalBadge variant="lilac" size="sm">CIRCULAR LIST</BrutalBadge>
          </div>

          <p class="font-body text-xs text-neutral-700 mb-2 line-clamp-2">
            Audio players rely on circular linked lists for infinite looping. When the last track ends, its <code class="font-mono font-bold bg-[#ffd23f] px-1">next</code> pointer seamlessly references track 0 without special reset logic.
          </p>

          <!-- Interactive Mini Player -->
          <div class="p-2 sm:p-2.5 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111]">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-mono text-[9px] text-neutral-500">TRACK {{ currentSongIndex + 1 }} OF {{ songs.length }} (CIRCULAR)</span>
              <span class="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-[#ff3d81] text-white">
                {{ isPlaying ? 'PLAYING ♫' : 'PAUSED' }}
              </span>
            </div>
            <div class="font-display text-xs sm:text-sm text-black mb-2 truncate">
              {{ songs[currentSongIndex] }}
            </div>

            <!-- Player Controls -->
            <div class="flex items-center justify-center gap-1.5">
              <button
                type="button"
                class="brutal-btn bg-white p-1 border border-black shadow-[1px_1px_0_#111]"
                @click="prevSong"
              >
                <SkipBack class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                class="brutal-btn bg-[#ffd23f] px-2.5 py-1 border border-black shadow-[1px_1px_0_#111] flex items-center gap-1 font-mono text-xs"
                @click="togglePlay"
              >
                <component :is="isPlaying ? Pause : Play" class="w-3.5 h-3.5" />
                <span>{{ isPlaying ? 'PAUSE' : 'PLAY' }}</span>
              </button>
              <button
                type="button"
                class="brutal-btn bg-white p-1 border border-black shadow-[1px_1px_0_#111]"
                @click="nextSong"
              >
                <SkipForward class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-2 pt-1.5 border-t border-neutral-200 font-mono text-[10px] text-neutral-600">
          💡 Clicking "Next" on the final track loops directly back to Track 1 in O(1) time.
        </div>
      </div>

      <!-- Demo 2: Browser History (Doubly Linked) -->
      <div class="border-2 border-[#111111] bg-white p-4 shadow-[6px_6px_0px_#111111] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
            <div class="flex items-center gap-2">
              <Globe class="w-4 h-4 text-[#3ddc97]" />
              <h3 class="font-display text-sm uppercase">2. Browser History Navigation</h3>
            </div>
            <BrutalBadge variant="mint" size="sm">DOUBLY LINKED</BrutalBadge>
          </div>

          <p class="font-body text-xs text-neutral-700 mb-3">
            Web browsers maintain your navigation stack as a doubly linked list. Clicking Back navigates via <code class="font-mono font-bold bg-[#3ddc97] px-1">prev</code>, clicking Forward uses <code class="font-mono font-bold bg-[#3ddc97] px-1">next</code>, and visiting a new URL truncates all forward references.
          </p>

          <!-- Interactive Browser Chrome Bar -->
          <div class="p-3 bg-[#fdf9f0] border-2 border-black shadow-[3px_3px_0_#111] space-y-2">
            <!-- Nav buttons + URL bar -->
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                :disabled="historyIndex === 0"
                class="brutal-btn bg-white p-1 border border-black disabled:opacity-30"
                @click="goBack"
              >
                ◀
              </button>
              <button
                type="button"
                :disabled="historyIndex === history.length - 1"
                class="brutal-btn bg-white p-1 border border-black disabled:opacity-30"
                @click="goForward"
              >
                ▶
              </button>
              <div class="flex-1 bg-white border border-black px-2 py-1 font-mono text-xs truncate">
                https://{{ history[historyIndex] }}
              </div>
            </div>

            <!-- New URL Input -->
            <div class="flex items-center gap-1 pt-1">
              <input
                v-model="newUrlInput"
                type="text"
                placeholder="newsite.org"
                class="flex-1 bg-white border border-black px-2 py-0.5 font-mono text-xs outline-none"
                @keyup.enter="visitUrl"
              />
              <button
                type="button"
                class="brutal-btn bg-[#3ddc97] px-2 py-0.5 text-xs font-mono font-bold border border-black"
                @click="visitUrl"
              >
                VISIT
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-neutral-200 font-mono text-[11px] text-neutral-600">
          History size: {{ history.length }} nodes (current node at position {{ historyIndex + 1 }}).
        </div>
      </div>

      <!-- Demo 3: Undo / Redo Stacks -->
      <div class="border-2 border-[#111111] bg-white p-4 shadow-[6px_6px_0px_#111111] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
            <div class="flex items-center gap-2">
              <Undo2 class="w-4 h-4 text-[#ffd23f]" />
              <h3 class="font-display text-sm uppercase">3. Undo / Redo State Buffer</h3>
            </div>
            <BrutalBadge variant="yellow" size="sm">POINTER BUFFER</BrutalBadge>
          </div>

          <p class="font-body text-xs text-neutral-700 mb-3">
            Text editors and graphic design tools store document command histories as a chain of state delta nodes. Moving the pointer backward performs Undo; forward performs Redo.
          </p>

          <!-- Interactive Text Editor Simulation -->
          <div class="p-3 bg-[#fdf9f0] border-2 border-black shadow-[3px_3px_0_#111] space-y-2">
            <div class="bg-white border-2 border-black p-2 font-mono text-xs min-h-[44px]">
              {{ editorText }}
            </div>

            <div class="flex flex-wrap items-center justify-between gap-1 pt-1">
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  :disabled="undoPointer === 0"
                  class="brutal-btn bg-[#ffd23f] px-2 py-1 text-xs font-mono font-bold border border-black flex items-center gap-1 disabled:opacity-30"
                  @click="handleUndo"
                >
                  <Undo2 class="w-3 h-3" />
                  <span>UNDO</span>
                </button>
                <button
                  type="button"
                  :disabled="undoPointer === undoStack.length - 1"
                  class="brutal-btn bg-[#ffd23f] px-2 py-1 text-xs font-mono font-bold border border-black flex items-center gap-1 disabled:opacity-30"
                  @click="handleRedo"
                >
                  <Redo2 class="w-3 h-3" />
                  <span>REDO</span>
                </button>
              </div>

              <!-- Quick Append Buttons -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="brutal-btn bg-white px-2 py-0.5 text-[11px] font-mono border border-black"
                  @click="typeText('🚀')"
                >
                  + 🚀
                </button>
                <button
                  type="button"
                  class="brutal-btn bg-white px-2 py-0.5 text-[11px] font-mono border border-black"
                  @click="typeText('Coding')"
                >
                  + Coding
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-neutral-200 font-mono text-[11px] text-neutral-600">
          State pointer at: {{ undoPointer + 1 }} / {{ undoStack.length }} states.
        </div>
      </div>

      <!-- Demo 4: OS Memory Freelist -->
      <div class="border-2 border-[#111111] bg-white p-4 shadow-[6px_6px_0px_#111111] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-2 mb-3 border-b-2 border-black">
            <div class="flex items-center gap-2">
              <Cpu class="w-4 h-4 text-[#ff6b5e]" />
              <h3 class="font-display text-sm uppercase">4. OS Kernel Memory Freelist</h3>
            </div>
            <BrutalBadge variant="coral" size="sm">MEMORY POOL</BrutalBadge>
          </div>

          <p class="font-body text-xs text-neutral-700 mb-3">
            Operating system kernels and C allocators (<code class="font-mono font-bold bg-[#ff6b5e]/30 px-1">malloc / free</code>) store unallocated RAM blocks in an intrusive linked list known as the <em>Freelist</em>.
          </p>

          <!-- Interactive Freelist Simulation -->
          <div class="p-3 bg-[#fdf9f0] border-2 border-black shadow-[3px_3px_0_#111] space-y-2">
            <div class="flex items-center gap-1.5 overflow-x-auto py-1">
              <div
                v-for="b in memoryBlocks"
                :key="b.id"
                class="px-2.5 py-1.5 border-2 border-black font-mono text-[10px] text-center flex-shrink-0"
                :class="b.status === 'free' ? 'bg-[#3ddc97] font-bold text-black shadow-[2px_2px_0_#111]' : 'bg-[#e5e5e5] text-neutral-500'"
              >
                {{ b.id }} ({{ b.size }}KB)<br>
                <span>{{ b.status.toUpperCase() }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="brutal-btn bg-[#3ddc97] px-2.5 py-1 text-xs font-mono font-bold border border-black shadow-[1px_1px_0_#000]"
                  @click="allocateBlock"
                >
                  malloc()
                </button>
                <button
                  type="button"
                  class="brutal-btn bg-[#ff6b5e] px-2.5 py-1 text-xs font-mono font-bold border border-black shadow-[1px_1px_0_#000]"
                  @click="freeBlock"
                >
                  free()
                </button>
              </div>
              <span class="font-mono text-[10px] text-neutral-600">O(1) allocation</span>
            </div>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-neutral-200 font-mono text-[11px] text-neutral-600">
          Intrusive pointers allow zero memory overhead for the freelist header!
        </div>
      </div>
    </div>
  </div>
</template>
