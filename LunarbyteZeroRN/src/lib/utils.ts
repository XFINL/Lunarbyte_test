import { Dimensions, Platform } from "react-native"

const { width, height } = Dimensions.get("window")

export const screenWidth = width
export const screenHeight = height

export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"