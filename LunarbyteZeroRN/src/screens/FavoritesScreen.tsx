import { useState, useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useUserStore } from "@/store/userStore"
import { usePlayerStore } from "@/store/playerStore"
import { IconHeartFilled, IconArrowLeft, IconArrowRight } from "@/components/Icons"

const ITEMS_PER_PAGE = 7
const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function FavoritesScreen() {
  const navigation = useNavigation()
  const favorites = useUserStore((state) => state.favorites)
  const { currentSong, play, togglePlay } = usePlayerStore()

  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(favorites.length / ITEMS_PER_PAGE))
  const currentPageSafe = Math.min(currentPage, totalPages - 1)

  const paginatedFavorites = useMemo(() => {
    const start = currentPageSafe * ITEMS_PER_PAGE
    return favorites.slice(start, start + ITEMS_PER_PAGE)
  }, [favorites, currentPageSafe])

  const handleSongPress = (song: any) => {
    if (currentSong?.id === song.id) {
      togglePlay()
    } else {
      play(song)
    }
  }

  const renderSongItem = ({ item }: { item: any }) => {
    const isActive = currentSong?.id === item.id
    return (
      <TouchableOpacity
        style={styles.songItem}
        onPress={() => handleSongPress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.cover }} style={styles.coverImage} />
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, isActive && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
        </View>
        {isActive && (
          <IconHeartFilled size={16} color="rgba(0,0,0,0.4)" />
        )}
      </TouchableOpacity>
    )
  }

  if (!favorites || favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <IconArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>点赞列表</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <IconHeartFilled size={48} color="rgba(0,0,0,0.2)" />
          <Text style={styles.emptyText}>还没有收藏的歌曲</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <IconArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>点赞列表</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={paginatedFavorites}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, currentPageSafe === 0 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPageSafe === 0}
          >
            <IconArrowLeft size={18} color={currentPageSafe === 0 ? "rgba(0,0,0,0.2)" : "#000"} />
          </TouchableOpacity>
          <Text style={styles.pageText}>
            {currentPageSafe + 1} / {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.pageButton, currentPageSafe >= totalPages - 1 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPageSafe >= totalPages - 1}
          >
            <IconArrowRight size={18} color={currentPageSafe >= totalPages - 1 ? "rgba(0,0,0,0.2)" : "#000"} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  coverImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.7)",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 12,
    color: "rgba(0,0,0,0.35)",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.3)",
    marginTop: 16,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingBottom: 32,
  },
  pageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    marginHorizontal: 16,
  },
})