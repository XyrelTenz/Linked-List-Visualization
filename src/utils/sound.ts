class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public setEnabled(val: boolean) {
    this.enabled = val
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public play(
    type: 'click' | 'step' | 'add' | 'remove' | 'success' | 'reverse' | 'whoosh' | 'tada' | 'tick' | 'buzzer',
  ) {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime

    switch (type) {
      case 'tick': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, now)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.045)
        break
      }
      case 'buzzer': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(140, now)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.36)
        break
      }
      case 'click': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(420, now)
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.05)
        break
      }
      case 'step': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(560, now)
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.06)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.06)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.07)
        break
      }
      case 'add': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(660, now + 0.05)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.13)
        break
      }
      case 'remove': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.09)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.11)
        break
      }
      case 'success': {
        const notes = [587.33, 880] // D5, A5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.08)
          gain.gain.setValueAtTime(0.15, now + idx * 0.08)
          gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.18)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + idx * 0.08)
          osc.stop(now + idx * 0.08 + 0.2)
        })
        break
      }
      case 'reverse': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(260, now)
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.15)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.17)
        break
      }
      case 'whoosh': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
        break
      }
      case 'tada': {
        // Major chord arpeggio
        const chord = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          const start = now + i * 0.06
          osc.frequency.setValueAtTime(freq, start)
          gain.gain.setValueAtTime(0.18, start)
          gain.gain.exponentialRampToValueAtTime(0.005, start + 0.25)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(start)
          osc.stop(start + 0.26)
        })
        break
      }
    }
  }
}

export const sound = new SoundManager()
