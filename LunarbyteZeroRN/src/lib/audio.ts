import { Audio } from "expo-av"

let sound: Audio.Sound | null = null

export async function initAudioEngine() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  })
}

async function getSound(): Promise<Audio.Sound> {
  if (!sound) {
    sound = new Audio.Sound()
  }
  return sound
}

export async function playAudio(url: string) {
  try {
    const s = await getSound()
    await s.unloadAsync()
    await s.loadAsync({ uri: url })
    await s.playAsync()
  } catch {
    // silent
  }
}

export async function resumeAudio() {
  try {
    const s = await getSound()
    await s.playAsync()
  } catch {
    // silent
  }
}

export async function pauseAudio() {
  try {
    const s = await getSound()
    await s.pauseAsync()
  } catch {
    // silent
  }
}

export async function seekAudio(percent: number) {
  try {
    const s = await getSound()
    const status = await s.getStatusAsync()
    if (status.isLoaded && status.durationMillis) {
      const position = (percent / 100) * status.durationMillis
      await s.setPositionAsync(position)
    }
  } catch {
    // silent
  }
}

export async function getAudioDuration(): Promise<number> {
  try {
    const s = await getSound()
    const status = await s.getStatusAsync()
    if (status.isLoaded && status.durationMillis) {
      return status.durationMillis / 1000
    }
  } catch {
    // silent
  }
  return 0
}

export async function getPlaybackProgress(): Promise<number> {
  try {
    const s = await getSound()
    const status = await s.getStatusAsync()
    if (status.isLoaded && status.durationMillis && status.durationMillis > 0) {
      return (status.positionMillis / status.durationMillis) * 100
    }
  } catch {
    // silent
  }
  return 0
}

export async function onPlaybackStatusUpdate(
  callback: (progress: number, isPlaying: boolean, didJustFinish: boolean) => void,
) {
  try {
    const s = await getSound()
    s.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        const progress = status.durationMillis
          ? (status.positionMillis / status.durationMillis) * 100
          : 0
        callback(progress, status.isPlaying, status.didJustFinish)
      }
    })
  } catch {
    // silent
  }
}