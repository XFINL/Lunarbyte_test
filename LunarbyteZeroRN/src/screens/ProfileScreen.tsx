import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useUserStore } from "@/store/userStore"
import {
  IconUser,
  IconHeartFilled,
  IconClose,
  IconSearch,
  IconSettings,
  IconArrowRight,
} from "@/components/Icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const { profile, favorites, updateName, getRemainingSearches, getDailyLimit } = useUserStore()
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(profile.name)

  const handleSaveName = () => {
    Keyboard.dismiss()
    const trimmed = nameInput.trim()
    if (trimmed) {
      updateName(trimmed)
    } else {
      setNameInput(profile.name)
    }
    setEditing(false)
  }

  const remaining = getRemainingSearches()
  const dailyLimit = getDailyLimit()

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Settings button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={styles.settingsButton}
      >
        <IconSettings size={20} color="rgba(0,0,0,0.3)" />
      </TouchableOpacity>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
          ) : (
            <IconUser size={28} color="rgba(0,0,0,0.3)" />
          )}
        </View>
        <View style={styles.profileInfo}>
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                onSubmitEditing={handleSaveName}
                returnKeyType="done"
                style={styles.nameInput}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>保存</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setEditing(false); setNameInput(profile.name) }}
              >
                <IconClose size={16} color="rgba(0,0,0,0.3)" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>{profile.name}</Text>
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editText}>编辑</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.userMeta}>
            {favorites.length} 首收藏 · {profile.isVip ? "VIP" : "普通用户"}
          </Text>
        </View>
      </View>

      {/* Search quota */}
      <View style={styles.quotaCard}>
        <View style={styles.quotaHeader}>
          <View style={styles.quotaLabel}>
            <IconSearch size={16} color="rgba(0,0,0,0.4)" />
            <Text style={styles.quotaLabelText}>今日搜索额度</Text>
          </View>
          <Text style={styles.quotaCount}>
            {remaining} / {dailyLimit}
          </Text>
        </View>
        <View style={styles.quotaBar}>
          <View style={[styles.quotaFill, { width: `${((dailyLimit - remaining) / dailyLimit) * 100}%` as any }]} />
        </View>
      </View>

      {/* Favorites link */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={styles.favLink}
      >
        <View style={styles.favLinkLeft}>
          <IconHeartFilled size={18} color="rgba(0,0,0,0.4)" />
          <Text style={styles.favLinkText}>点赞列表</Text>
        </View>
        <View style={styles.favLinkRight}>
          <Text style={styles.favLinkCount}>{favorites.length} 首</Text>
          <IconArrowRight size={14} color="rgba(0,0,0,0.3)" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 6,
    zIndex: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    flexShrink: 1,
  },
  editText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.3)",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveBtnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  userMeta: {
    fontSize: 13,
    color: "rgba(0,0,0,0.4)",
    marginTop: 4,
  },
  // Quota card
  quotaCard: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  quotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quotaLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quotaLabelText: {
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
  },
  quotaCount: {
    fontSize: 11,
    color: "rgba(0,0,0,0.3)",
  },
  quotaBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  quotaFill: {
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 4,
  },
  // Favorites link
  favLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 16,
    padding: 16,
  },
  favLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  favLinkText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  favLinkRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  favLinkCount: {
    fontSize: 11,
    color: "rgba(0,0,0,0.3)",
  },
})