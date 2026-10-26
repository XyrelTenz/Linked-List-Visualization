export interface SlideMeta {
  id: number
  slug: string
  title: string
  shortTitle: string
  badge: string
  color: 'pink' | 'yellow' | 'mint' | 'lilac' | 'coral'
  description: string
}

export interface ListNodeItem {
  id: string
  val: number
  address: string
  nextAddress: string | null
  prevAddress?: string | null
  highlight?: boolean
  isTarget?: boolean
  status?: 'normal' | 'head' | 'tail' | 'highlight' | 'matched' | 'inserting' | 'deleting'
}

export interface VisualizerLog {
  id: string
  time: string
  action: string
  details: string
  type: 'info' | 'success' | 'warn' | 'pointer'
}
