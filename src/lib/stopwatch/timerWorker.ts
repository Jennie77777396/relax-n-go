let interval: ReturnType<typeof setInterval> | null = null

self.onmessage = (e: MessageEvent) => {
  if (e.data.type === 'START') {
    interval = setInterval(() => {
      self.postMessage({ type: 'TICK' })
    }, 1000)
  } else if (e.data.type === 'STOP') {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }
}

export {}
