import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { View, StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { usePlayerStore } from "@/store/playerStore"
import { useUserStore } from "@/store/userStore"
import { useSearchStore } from "@/store/searchStore"
import PlayerEngine from "@/components/PlayerEngine"

import { IconSearch, IconUser, IconPlay, IconPause } from "@/components/Icons"

import HomeScreen from "@/screens/HomeScreen"
import SearchScreen from "@/screens/SearchScreen"
import ProfileScreen from "@/screens/ProfileScreen"
import FavoritesScreen from "@/screens/FavoritesScreen"
import SettingsScreen from "@/screens/SettingsScreen"
import SettingsGeneralScreen from "@/screens/SettingsGeneralScreen"
import SettingsExperimentalScreen from "@/screens/SettingsExperimentalScreen"
import SettingsLanguageScreen from "@/screens/SettingsLanguageScreen"
import SettingsAboutScreen from "@/screens/SettingsAboutScreen"

export type RootStackParamList = {
  MainTabs: undefined
  Favorites: undefined
  Settings: undefined
  SettingsGeneral: undefined
  SettingsExperimental: undefined
  SettingsLanguage: undefined
  SettingsAbout: undefined
}

export type TabParamList = {
  Search: undefined
  Home: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

function MainTabs() {
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "rgba(0,0,0,0.3)",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "搜索",
          tabBarIcon: ({ color }) => <IconSearch size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "首页",
          tabBarIcon: ({ focused }) =>
            focused && isPlaying ? (
              <IconPause size={22} color="#000" />
            ) : (
              <IconPlay size={22} color={focused ? "#000" : "rgba(0,0,0,0.3)"} />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ color }) => <IconUser size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const initPlayer = usePlayerStore((s) => s.init)
  const initUser = useUserStore((s) => s.init)
  const initSearch = useSearchStore((s) => s.init)

  useEffect(() => {
    initPlayer()
    initUser()
    initSearch()
  }, [initPlayer, initUser, initSearch])

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <PlayerEngine />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="SettingsGeneral"
              component={SettingsGeneralScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="SettingsExperimental"
              component={SettingsExperimentalScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="SettingsLanguage"
              component={SettingsLanguageScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="SettingsAbout"
              component={SettingsAboutScreen}
              options={{ animation: "slide_from_right" }}
            />
          </Stack.Navigator>
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 60,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
})