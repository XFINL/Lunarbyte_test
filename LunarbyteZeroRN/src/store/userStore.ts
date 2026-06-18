import { create } from "zustand"
import type { Song } from "@/data/mock"
import { loadJson, saveJson } from "@/lib/storage"

const USER_KEY = "userProfile"
const QUOTA_KEY = "searchQuota"
const SETTINGS_KEY = "appSettings"
const FAVORITES_KEY = "favorites"
const RECENT_KEY = "recentPlays"

interface UserProfile {
  name: string
  avatar: string
  isVip: boolean
}

interface AppSettings {
  fontSize: "small" | "normal" | "large"
  colorScheme: "white" | "blue" | "lavender" | "green"
  language: "zh" | "en"
  timerMinutes: number
}

interface SearchQuota {
  count: number
  date: string
}

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface UserState {
  profile: UserProfile
  favorites: Song[]
  recentPlays: Song[]
  quota: SearchQuota
  settings: AppSettings
  initialized: boolean
  updateName: (name: string) => void
  updateSettings: (s: Partial<AppSettings>) => void
  toggleFavorite: (song: Song) => void
  isFavorite: (songId: string) => boolean
  addRecentPlay: (song: Song) => void
  canSearch: () => boolean
  consumeSearch: () => boolean
  getRemainingSearches: () => number
  getDailyLimit: () => number
  init: () => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: { name: "音乐爱好者", avatar: "", isVip: false },
  favorites: [],
  recentPlays: [],
  quota: { count: 0, date: "" },
  settings: { fontSize: "normal", colorScheme: "white", language: "zh", timerMinutes: 0 },
  initialized: false,

  init: async () => {
    if (get().initialized) return
    try {
      const [profile, quota, settings, favorites, recentPlays] = await Promise.all([
        loadJson<UserProfile>(USER_KEY),
        loadJson<SearchQuota>(QUOTA_KEY),
        loadJson<AppSettings>(SETTINGS_KEY),
        loadJson<Song[]>(FAVORITES_KEY),
        loadJson<Song[]>(RECENT_KEY),
      ])
      const today = getToday()
      // Reset quota if not today
      const validQuota = quota?.date === today ? quota : { count: 0, date: today }
      set({
        profile: profile ?? { name: "音乐爱好者", avatar: "", isVip: false },
        quota: validQuota,
        settings: settings ?? { fontSize: "normal", colorScheme: "white", language: "zh", timerMinutes: 0 },
        favorites: favorites ?? [],
        recentPlays: recentPlays ?? [],
        initialized: true,
      })
    } catch {
      set({ initialized: true })
    }
  },

  updateName: (name) => {
    const updated = { ...get().profile, name }
    set({ profile: updated })
    saveJson(USER_KEY, updated)
  },

  updateSettings: (partial) => {
    const current = get().settings
    const updated = { ...current, ...partial }
    set({ settings: updated })
    saveJson(SETTINGS_KEY, updated)
  },

  toggleFavorite: (song) => {
    const { favorites } = get()
    const exists = favorites.some((s) => s.id === song.id)
    let next: Song[]
    if (exists) {
      next = favorites.filter((s) => s.id !== song.id)
    } else {
      next = [...favorites, song]
    }
    set({ favorites: next })
    saveJson(FAVORITES_KEY, next)
  },

  isFavorite: (songId) => get().favorites.some((s) => s.id === songId),

  addRecentPlay: (song) => {
    const { recentPlays } = get()
    const filtered = recentPlays.filter((s) => s.id !== song.id)
    const next = [song, ...filtered].slice(0, 20)
    set({ recentPlays: next })
    saveJson(RECENT_KEY, next)
  },

  canSearch: () => {
    const { quota, profile } = get()
    const max = profile.isVip ? 100 : 12
    return quota.count < max
  },

  consumeSearch: () => {
    const { quota, profile } = get()
    const max = profile.isVip ? 100 : 12
    if (quota.count >= max) return false
    const updated = { count: quota.count + 1, date: quota.date }
    set({ quota: updated })
    saveJson(QUOTA_KEY, updated)
    return true
  },

  getRemainingSearches: () => {
    const { quota, profile } = get()
    const max = profile.isVip ? 100 : 12
    return Math.max(0, max - quota.count)
  },

  getDailyLimit: () => {
    return get().profile.isVip ? 100 : 12
  },
}))