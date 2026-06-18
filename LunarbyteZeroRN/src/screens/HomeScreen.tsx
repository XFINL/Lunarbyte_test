import { useCallback, useRef, useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Animated,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { usePlayerStore } from "@/store/playerStore"
import { useUserStore } from "@/store/userStore"
import { formatTime } from "@/data/mock"
import {
  IconList,
  IconClose,
  IconMusic,
  IconPlay,
  IconHeart,
  IconHeartFilled,
} from "@/components/Icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const COVER_SIZE = SCREEN_WIDTH - 64

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const {
    currentSong, isPlaying, progress, playlist,
    next, prev, setProgress, removeFromPlaylist, clearPlaylist, play, resumeFromPlaylist,
  } = usePlayerStore()
  const { isFavorite, toggleFavorite } = useUserStore()

  useEffect(() => {
    resumeFromPlaylist()
  }, [resumeFromPlaylist])

  // Swipe gesture
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const [swipeDir, setSwipeDir] = useState<"up" | "down" | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [showPlaylist, setShowPlaylist] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: swipeDir ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [swipeDir, fadeAnim])

  const handleTouchStart = useCallback((evt: any) => {
    touchStartY.current = evt.nativeEvent.pageY
    touchEndY.current = evt.nativeEvent.pageY
  }, [])

  const handleTouchMove = useCallback((evt: any) => {
    touchEndY.current = evt.nativeEvent.pageY
    const diff = touchStartY.current - touchEndY.current
    if (Math.abs(diff) > 20) {
      setSwipeDir(diff > 0 ? "up" : "down")
    } else {
      setSwipeDir(null)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartY.current - touchEndY.current
    if (diff > 60) {
      next()
    } else if (diff < -60) {
      prev()
    }
    setSwipeDir(null)
  }, [next, prev])

  const displaySong = currentSong ?? playlist[0]
  const isDefault = displaySong?.id === "__default__"
  const currentDuration = Math.floor((progress / 100) * (displaySong?.duration || 0))

  const handleItemTouchStart = (songId: string) => {
    longPressTimer.current = setTimeout(() => {
      setConfirmRemove(songId)
    }, 500)
  }
  const handleItemTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Playlist button */}
      <TouchableOpacity
        onPress={() => setShowPlaylist(true)}
        style={styles.listButton}
      >
        <IconList size={22} color="rgba(0,0,0,0.4)" />
      </TouchableOpacity>

      {/* Swipe indicators */}
      <Animated.View style={[styles.swipeIndicator, styles.swipeUp, { opacity: fadeAnim }]}>
        <Text style={styles.swipeText}>下一首</Text>
      </Animated.View>
      <Animated.View style={[styles.swipeIndicator, styles.swipeDown, { opacity: fadeAnim }]}>
        <Text style={styles.swipeText}>上一首</Text>
      </Animated.View>

      {/* Album cover */}
      <View
        style={styles.coverArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <View style={[styles.coverWrapper, { width: COVER_SIZE, height: COVER_SIZE }]}>
          <Image
            source={{ uri: displaySong?.cover }}
            style={styles.coverImage}
          />
        </View>
      </View>

      {/* Song info */}
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {displaySong?.title || ""}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {displaySong?.artist || ""}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressArea}>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${progress}%` as any }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentDuration)}</Text>
          <Text style={styles.timeText}>{formatTime(displaySong?.duration || 0)}</Text>
        </View>
      </View>

      {/* Playlist Modal */}
      <Modal visible={showPlaylist} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPlaylist(false)} />
        <View style={[styles.playlistPanel, { maxHeight: "70%" as any }]}>
          <View style={styles.playlistHeader}>
            <Text style={styles.playlistTitle}>播放列表（{playlist.length}）</Text>
            <View style={styles.playlistHeaderRight}>
              {playlist.length > 0 && (
                <TouchableOpacity onPress={() => setConfirmClearAll(true)}>
                  <Text style={styles.clearAllText}>全部移除</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowPlaylist(false)}>
                <IconClose size={18} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.playlistContent}>
            {playlist.length === 0 ? (
              <View style={styles.emptyList}>
                <IconMusic size={40} color="rgba(0,0,0,0.2)" />
                <Text style={styles.emptyListText}>播放列表为空</Text>
              </View>
            ) : (
              playlist.map((song) => {
                const isActive = currentSong?.id === song.id
                return (
                  <TouchableOpacity
                    key={song.id}
                    onPress={() => { play(song); setShowPlaylist(false) }}
                    onLongPress={() => setConfirmRemove(song.id)}
                    style={[styles.playlistItem, isActive && styles.playlistItemActive]}
                  >
                    <Image source={{ uri: song.cover }} style={styles.playlistItemCover} />
                    <View style={styles.playlistItemInfo}>
                      <Text
                        style={[styles.playlistItemTitle, isActive && styles.activeText]}
                        numberOfLines={1}
                      >
                        {song.title}
                      </Text>
                      <Text style={styles.playlistItemArtist} numberOfLines={1}>
                        {song.artist}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(song)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {isFavorite(song.id) ? (
                        <IconHeartFilled size={14} color="#000" />
                      ) : (
                        <IconHeart size={14} color="rgba(0,0,0,0.2)" />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              })
            )}
          </View>
        </View>
      </Modal>

      {/* Confirm Remove Modal */}
      <Modal visible={!!confirmRemove} transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmText}>是否从播放列表中移除该歌曲？</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setConfirmRemove(null)}
                style={[styles.confirmBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { if (confirmRemove) removeFromPlaylist(confirmRemove); setConfirmRemove(null) }}
                style={[styles.confirmBtn, styles.deleteBtn]}
              >
                <Text style={styles.deleteBtnText}>移除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Clear All Modal */}
      <Modal visible={confirmClearAll} transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmText}>确定要清空播放列表吗？</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setConfirmClearAll(false)}
                style={[styles.confirmBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { clearPlaylist(); setConfirmClearAll(false); setShowPlaylist(false) }}
                style={[styles.confirmBtn, styles.deleteBtn]}
              >
                <Text style={styles.deleteBtnText}>清空</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  listButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  swipeIndicator: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 5,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  swipeUp: {
    top: 48,
  },
  swipeDown: {
    bottom: 180,
  },
  swipeText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
  },
  coverArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  coverWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  songInfo: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.3,
  },
  songArtist: {
    fontSize: 15,
    color: "rgba(0,0,0,0.4)",
    marginTop: 4,
  },
  progressArea: {
    width: "100%",
    marginTop: 32,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 11,
    color: "rgba(0,0,0,0.3)",
  },
  // Playlist Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playlistPanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  playlistHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  playlistTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  playlistHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearAllText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.3)",
  },
  playlistContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyList: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyListText: {
    fontSize: 13,
    color: "rgba(0,0,0,0.2)",
    marginTop: 12,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  playlistItemActive: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  playlistItemCover: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
  },
  playlistItemInfo: {
    flex: 1,
  },
  playlistItemTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(0,0,0,0.7)",
  },
  playlistItemArtist: {
    fontSize: 11,
    color: "rgba(0,0,0,0.35)",
    marginTop: 2,
  },
  activeText: {
    color: "#000",
  },
  // Confirm Modals
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  confirmDialog: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 40,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    fontSize: 13,
    textAlign: "center",
    color: "rgba(0,0,0,0.7)",
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  cancelBtnText: {
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
  },
  deleteBtn: {
    backgroundColor: "#000",
  },
  deleteBtnText: {
    fontSize: 13,
    color: "#fff",
  },
})