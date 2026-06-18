import { useState, useCallback, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Keyboard,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSearchStore } from "@/store/searchStore"
import { usePlayerStore } from "@/store/playerStore"
import { useUserStore } from "@/store/userStore"
import { IconSearch, IconClose, IconHeart, IconHeartFilled } from "@/components/Icons"
import type { Song } from "@/data/mock"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function SearchScreen() {
  const insets = useSafeAreaInsets()
  const { query, setQuery, results, history, search, removeHistory, clearHistory, loading } =
    useSearchStore()
  const { play, currentSong, togglePlay } = usePlayerStore()
  const { isFavorite, toggleFavorite } = useUserStore()
  const { consumeSearch } = useUserStore()
  const [toast, setToast] = useState<string | null>(null)
  const [confirmDeleteTag, setConfirmDeleteTag] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const handleSearchPress = useCallback(async () => {
    Keyboard.dismiss()
    const q = query.trim()
    if (!q) return
    if (!consumeSearch()) {
      setToast("今日搜索次数已达上限")
      return
    }
    await search(q)
  }, [query, search, consumeSearch])

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (!value.trim()) {
        search("")
      }
    },
    [setQuery, search],
  )

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay()
    } else {
      play(song)
    }
  }

  const renderSongItem = ({ item: song }: { item: Song }) => {
    const isActive = currentSong?.id === song.id
    const isFav = isFavorite(song.id)
    return (
      <TouchableOpacity
        onPress={() => handlePlaySong(song)}
        style={styles.songItem}
      >
        <Image source={{ uri: song.cover }} style={styles.songCover} />
        <View style={styles.songInfo}>
          <Text
            style={[styles.songTitle, isActive && styles.activeTitle]}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleFavorite(song)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isFav ? (
            <IconHeartFilled size={16} color="#000" />
          ) : (
            <IconHeart size={16} color="rgba(0,0,0,0.2)" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Toast */}
      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>
            已添加「{toast}」
          </Text>
        </View>
      )}

      {/* Title */}
      <Text style={styles.title}>搜索</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <IconSearch size={18} color="rgba(0,0,0,0.25)" />
        <TextInput
          value={query}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSearchPress}
          returnKeyType="search"
          placeholder="搜索歌曲、歌手..."
          placeholderTextColor="rgba(0,0,0,0.25)"
          style={styles.searchInput}
        />
        {query ? (
          <TouchableOpacity onPress={() => handleInputChange("")}>
            <IconClose size={16} color="rgba(0,0,0,0.2)" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleSearchPress} disabled={loading}>
          <IconSearch size={18} color="rgba(0,0,0,0.3)" />
        </TouchableOpacity>
      </View>

      {/* Search history */}
      {!query && history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyLabel}>搜索历史</Text>
            <TouchableOpacity onPress={() => setConfirmClearAll(true)}>
              <Text style={styles.clearHistoryText}>全部删除</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {history.map((keyword) => (
              <TouchableOpacity
                key={keyword}
                onPress={() => {
                  setQuery(keyword)
                  search(keyword)
                }}
                onLongPress={() => setConfirmDeleteTag(keyword)}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{keyword}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.tagHint}>长按标签可删除</Text>
        </View>
      )}

      {/* Results */}
      {query ? (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsCount}>
            找到 {results.length} 首歌曲
          </Text>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderSongItem}
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.emptyText}>未找到相关歌曲</Text>
              ) : null
            }
            contentContainerStyle={styles.resultsList}
          />
        </View>
      ) : null}

      {/* Confirm Modals */}
      <Modal visible={!!confirmDeleteTag} transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmText}>
              是否删除搜索词「{confirmDeleteTag}」？
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setConfirmDeleteTag(null)}
                style={[styles.confirmBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { if (confirmDeleteTag) removeHistory(confirmDeleteTag); setConfirmDeleteTag(null) }}
                style={[styles.confirmBtn, styles.deleteBtn]}
              >
                <Text style={styles.deleteBtnText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmClearAll} transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmText}>确定要清空所有搜索历史吗？</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                onPress={() => setConfirmClearAll(false)}
                style={[styles.confirmBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { clearHistory(); setConfirmClearAll(false) }}
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  toast: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 50,
  },
  toastText: {
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 0,
  },
  historySection: {
    marginTop: 24,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyLabel: {
    fontSize: 13,
    color: "rgba(0,0,0,0.4)",
  },
  clearHistoryText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.2)",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tagText: {
    fontSize: 13,
    color: "rgba(0,0,0,0.6)",
  },
  tagHint: {
    fontSize: 11,
    color: "rgba(0,0,0,0.15)",
    marginTop: 8,
  },
  resultsSection: {
    marginTop: 20,
    flex: 1,
  },
  resultsCount: {
    fontSize: 13,
    color: "rgba(0,0,0,0.3)",
    marginBottom: 12,
  },
  resultsList: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 48,
    fontSize: 13,
    color: "rgba(0,0,0,0.25)",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  songCover: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 13,
    color: "rgba(0,0,0,0.7)",
  },
  activeTitle: {
    color: "#000",
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 11,
    color: "rgba(0,0,0,0.35)",
    marginTop: 2,
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