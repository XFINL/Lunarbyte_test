import { useEffect } from "react"
import { usePlayerStore } from "@/store/playerStore"
import { useUserStore } from "@/store/userStore"
import { initAudioEngine, onPlaybackStatusUpdate } from "@/lib/audio"

export default function PlayerEngine() {
  const { currentSong, isPlaying, setProgress } = usePlayerStore()
  const { addRecentPlay } = useUserStore()

  useEffect(() => {
    initAudioEngine()
  }, [])

  // Track playback progress
  useEffect(() => {
    onPlaybackStatusUpdate((progress, playing, didJustFinish) => {
      setProgress(progress)
      if (didJustFinish) {
        usePlayerStore.getState().next()
      }
    })
  }, [setProgress])

  useEffect(() => {
    if (isPlaying && currentSong) {
      addRecentPlay(currentSong)
    }
  }, [isPlaying, currentSong, addRecentPlay])

  return null
}