import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ListNodeItem, VisualizerLog } from '../types/deck'
import { sound } from '../utils/sound'

export const useVisualizerStore = defineStore('visualizer', () => {
  const nodes = ref<ListNodeItem[]>([
    { id: 'n1', val: 12, address: '0x10A', nextAddress: '0x3F2', status: 'head' },
    { id: 'n2', val: 45, address: '0x3F2', nextAddress: '0x7B0', status: 'normal' },
    { id: 'n3', val: 78, address: '0x7B0', nextAddress: '0x99C', status: 'normal' },
    { id: 'n4', val: 99, address: '0x99C', nextAddress: null, status: 'tail' }
  ])

  const activeIndex = ref<number | null>(null)
  const isAnimating = ref<boolean>(false)
  const logs = ref<VisualizerLog[]>([
    {
      id: 'l1',
      time: '00:00:01',
      action: 'INIT',
      details: 'Initialized Singly Linked List with 4 nodes in dynamic heap.',
      type: 'info'
    }
  ])

  function getRandomHex(len = 3): string {
    const chars = '0123456789ABCDEF'
    let res = '0x'
    for (let i = 0; i < len; i++) {
      res += chars[Math.floor(Math.random() * chars.length)]
    }
    return res
  }

  function addLog(action: string, details: string, type: 'info' | 'success' | 'warn' | 'pointer' = 'info') {
    const time = new Date().toTimeString().split(' ')[0] || '00:00:00'
    logs.value.unshift({
      id: Math.random().toString(36).substring(2, 9),
      time,
      action,
      details,
      type
    })
    if (logs.value.length > 30) {
      logs.value.pop()
    }
  }

  function refreshStatuses() {
    const n = nodes.value
    n.forEach((node, i) => {
      const nextNode = n[i + 1]
      const prevNode = n[i - 1]
      node.nextAddress = nextNode ? nextNode.address : null
      node.prevAddress = prevNode ? prevNode.address : null
      if (node.status !== 'highlight' && node.status !== 'matched') {
        if (i === 0) node.status = 'head'
        else if (i === n.length - 1) node.status = 'tail'
        else node.status = 'normal'
      }
    })
  }

  async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function insertHead(val: number) {
    if (isAnimating.value) return
    isAnimating.value = true
    sound.play('click')

    const newAddr = getRandomHex()
    const firstNode = nodes.value[0]
    addLog('INSERT_HEAD', `Allocated new node [${val}] at heap address ${newAddr}. Setting next -> ${firstNode ? firstNode.address : 'null'}`, 'pointer')

    const newNode: ListNodeItem = {
      id: Math.random().toString(36).substring(2, 9),
      val,
      address: newAddr,
      nextAddress: firstNode ? firstNode.address : null,
      status: 'inserting'
    }

    nodes.value.unshift(newNode)
    sound.play('add')
    await delay(350)
    refreshStatuses()
    addLog('UPDATE_HEAD', `HEAD pointer now points to ${newAddr} (val: ${val}). O(1) time complexity.`, 'success')
    isAnimating.value = false
  }

  async function insertTail(val: number) {
    if (isAnimating.value) return
    isAnimating.value = true
    sound.play('click')

    const newAddr = getRandomHex()
    const newNode: ListNodeItem = {
      id: Math.random().toString(36).substring(2, 9),
      val,
      address: newAddr,
      nextAddress: null,
      status: 'inserting'
    }

    if (nodes.value.length > 0) {
      const last = nodes.value[nodes.value.length - 1]
      if (last) {
        addLog('INSERT_TAIL', `Updated node at ${last.address}.next -> ${newAddr}`, 'pointer')
        last.nextAddress = newAddr
      }
    }

    nodes.value.push(newNode)
    activeIndex.value = nodes.value.length - 1
    sound.play('add')
    await delay(500)
    refreshStatuses()
    activeIndex.value = null
    addLog('UPDATE_TAIL', `Appended [${val}] at ${newAddr}. TAIL updated.`, 'success')
    isAnimating.value = false
  }

  async function insertAt(index: number, val: number) {
    if (isAnimating.value) return
    if (index <= 0) return insertHead(val)
    if (index >= nodes.value.length) return insertTail(val)

    isAnimating.value = true
    sound.play('click')

    // Traversal step
    addLog('TRAVERSAL', `Traversing from HEAD to index ${index - 1} to splice new node...`, 'info')
    for (let i = 0; i < index; i++) {
      activeIndex.value = i
      sound.play('step')
      await delay(300)
    }

    const prevNode = nodes.value[index - 1]
    const nextNode = nodes.value[index]
    const newAddr = getRandomHex()

    if (prevNode && nextNode) {
      addLog('SPLICE', `Splicing [${val}] between ${prevNode.address} and ${nextNode.address}`, 'pointer')
      const newNode: ListNodeItem = {
        id: Math.random().toString(36).substring(2, 9),
        val,
        address: newAddr,
        nextAddress: nextNode.address,
        status: 'inserting'
      }

      nodes.value.splice(index, 0, newNode)
      sound.play('add')
      await delay(400)
    }

    activeIndex.value = null
    refreshStatuses()
    addLog('SUCCESS', `Inserted [${val}] at index ${index}. Next pointers linked.`, 'success')
    isAnimating.value = false
  }

  async function deleteHead() {
    if (isAnimating.value || nodes.value.length === 0) return
    isAnimating.value = true
    sound.play('click')

    const target = nodes.value[0]
    if (!target) {
      isAnimating.value = false
      return
    }

    target.status = 'deleting'
    addLog('DELETE_HEAD', `Advancing HEAD pointer to head.next (${nodes.value[1]?.address || 'null'})`, 'warn')
    sound.play('remove')
    await delay(400)

    nodes.value.shift()
    refreshStatuses()
    addLog('GARBAGE_COLLECT', `Freed memory at ${target.address} (val: ${target.val}). O(1) time.`, 'success')
    isAnimating.value = false
  }

  async function deleteTail() {
    if (isAnimating.value || nodes.value.length === 0) return
    if (nodes.value.length === 1) return deleteHead()

    isAnimating.value = true
    sound.play('click')

    // Traversal to second-to-last node
    addLog('TRAVERSAL', `Traversing to (n-1)-th node to clear its next pointer...`, 'info')
    for (let i = 0; i < nodes.value.length - 1; i++) {
      activeIndex.value = i
      sound.play('step')
      await delay(250)
    }

    const target = nodes.value[nodes.value.length - 1]
    if (!target) {
      activeIndex.value = null
      isAnimating.value = false
      return
    }

    target.status = 'deleting'
    sound.play('remove')
    await delay(350)

    nodes.value.pop()
    activeIndex.value = null
    refreshStatuses()
    addLog('DELETE_TAIL', `Removed tail at ${target.address}. New tail points to null.`, 'success')
    isAnimating.value = false
  }

  async function deleteVal(val: number) {
    if (isAnimating.value || nodes.value.length === 0) return
    isAnimating.value = true
    sound.play('click')

    addLog('SEARCH_DELETE', `Searching for first node with val == ${val}...`, 'info')
    let foundIndex = -1
    for (let i = 0; i < nodes.value.length; i++) {
      activeIndex.value = i
      sound.play('step')
      await delay(300)
      const currentNode = nodes.value[i]
      if (currentNode && currentNode.val === val) {
        foundIndex = i
        break
      }
    }

    if (foundIndex === -1) {
      addLog('NOT_FOUND', `Value ${val} not found in the list.`, 'warn')
      activeIndex.value = null
      isAnimating.value = false
      return
    }

    const target = nodes.value[foundIndex]
    if (!target) {
      activeIndex.value = null
      isAnimating.value = false
      return
    }

    target.status = 'deleting'
    sound.play('remove')
    await delay(400)

    nodes.value.splice(foundIndex, 1)
    activeIndex.value = null
    refreshStatuses()
    addLog('DELETE_SUCCESS', `Bypassed & deleted node ${target.address} with val ${val}.`, 'success')
    isAnimating.value = false
  }

  async function searchVal(val: number) {
    if (isAnimating.value || nodes.value.length === 0) return
    isAnimating.value = true
    sound.play('click')

    addLog('SEARCH', `Starting linear search for val == ${val} from HEAD...`, 'info')
    let found = false
    for (let i = 0; i < nodes.value.length; i++) {
      activeIndex.value = i
      sound.play('step')
      await delay(350)
      const currentNode = nodes.value[i]
      if (currentNode && currentNode.val === val) {
        currentNode.status = 'matched'
        sound.play('success')
        addLog('FOUND', `Match found at index ${i} (address: ${currentNode.address})!`, 'success')
        found = true
        await delay(900)
        break
      }
    }

    if (!found) {
      addLog('NOT_FOUND', `Value ${val} not found after traversing all ${nodes.value.length} nodes (O(n)).`, 'warn')
    }

    activeIndex.value = null
    refreshStatuses()
    isAnimating.value = false
  }

  async function reverseList() {
    if (isAnimating.value || nodes.value.length <= 1) return
    isAnimating.value = true
    sound.play('reverse')

    addLog('REVERSE_START', `Reversing Singly Linked List: tracking prev, curr, next pointers...`, 'pointer')

    // Visual step through pointers
    const copy = [...nodes.value]
    for (let i = 0; i < copy.length; i++) {
      activeIndex.value = i
      const item = copy[i]
      if (item) {
        item.status = 'highlight'
      }
      sound.play('step')
      await delay(250)
    }

    // Reverse array order
    nodes.value.reverse()
    refreshStatuses()
    sound.play('success')
    const newHead = nodes.value[0]
    addLog('REVERSE_COMPLETE', `Reversed in O(n) time and O(1) auxiliary space! New HEAD is ${newHead ? newHead.address : 'null'}.`, 'success')

    await delay(300)
    activeIndex.value = null
    refreshStatuses()
    isAnimating.value = false
  }

  function resetPreset(type: 'default' | 'small' | 'large' | 'empty') {
    sound.play('click')
    activeIndex.value = null
    if (type === 'empty') {
      nodes.value = []
      addLog('RESET', 'Cleared linked list. HEAD -> null', 'warn')
      return
    }

    if (type === 'small') {
      nodes.value = [
        { id: 's1', val: 10, address: '0x100', nextAddress: '0x200', status: 'head' },
        { id: 's2', val: 20, address: '0x200', nextAddress: null, status: 'tail' }
      ]
    } else if (type === 'large') {
      const vals = [14, 28, 42, 56, 70, 84]
      nodes.value = vals.map((v, i) => ({
        id: 'lg' + i,
        val: v,
        address: getRandomHex(),
        nextAddress: null,
        status: i === 0 ? 'head' : i === vals.length - 1 ? 'tail' : 'normal'
      }))
    } else {
      nodes.value = [
        { id: 'n1', val: 12, address: '0x10A', nextAddress: '0x3F2', status: 'head' },
        { id: 'n2', val: 45, address: '0x3F2', nextAddress: '0x7B0', status: 'normal' },
        { id: 'n3', val: 78, address: '0x7B0', nextAddress: '0x99C', status: 'normal' },
        { id: 'n4', val: 99, address: '0x99C', nextAddress: null, status: 'tail' }
      ]
    }
    refreshStatuses()
    addLog('RESET', `Reset list to ${type} configuration (${nodes.value.length} nodes).`, 'info')
  }

  return {
    nodes,
    activeIndex,
    isAnimating,
    logs,
    insertHead,
    insertTail,
    insertAt,
    deleteHead,
    deleteTail,
    deleteVal,
    searchVal,
    reverseList,
    resetPreset,
    addLog
  }
})
