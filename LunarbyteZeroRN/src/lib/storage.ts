import AsyncStorage from "@react-native-async-storage/async-storage"

export async function saveJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key)
  if (raw === null) return null
  return JSON.parse(raw) as T
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key)
}