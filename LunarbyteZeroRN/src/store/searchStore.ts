import { create } from "zustand"
import { searchSongs } from "@/lib/api"
import type { Song } from "@/data/mock"
import { loadJson, saveJson } from "@/lib/storage"

const STORAGE_KEY = "searchHistory"

function toSong(api: { id: string; title: string; author: string; pic: string; url: string }): Song {
  return {
    id: api.id,
    title: api.title,
    artist: api.author,
    cover: api.pic.replace(/^http:/, "https:"),
    duration: 240,
    album: api.title,
    url: api.url,
  }
}

interface SearchState {
  query: string
  history: string[]
  results: Song[]
  loading: boolean
  initialized: boolean
  setQuery: (q: string) => void
  search: (q: string) => Promise<void>
  addHistory: (keyword: string) => void
  removeHistory: (keyword: string) => void
  clearHistory: () => void
  init: () => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  history: [],
  results: [],
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return
    try {
      const history = await loadJson<string[]>(STORAGE_KEY)
      if (history) set({ history, initialized: true })
      else set({ initialized: true })
    } catch {
      set({ initialized: true })
    }
  },

  setQuery: (q) => set({ query: q }),

  search: async (q) => {
    if (!q.trim()) {
      set({ results: [], loading: false })
      return
    }
    set({ loading: true })
    try {
      const apiResults = await searchSongs(q.trim())
      set({ results: apiResults.map(toSong), loading: false })
      get().addHistory(q.trim())
    } catch {
      set({ results: [], loading: false })
    }
  },

  addHistory: (keyword) => {
    const { history } = get()
    const filtered = history.filter((h) => h !== keyword)
    const updated = [keyword, ...filtered].slice(0, 10)
    set({ history: updated })
    saveJson(STORAGE_KEY, updated)
  },

  removeHistory: (keyword) => {
    const updated = get().history.filter((h) => h !== keyword)
    set({ history: updated })
    saveJson(STORAGE_KEY, updated)
  },

  clearHistory: () => {
    set({ history: [] })
    saveJson(STORAGE_KEY, [])
  },
}))