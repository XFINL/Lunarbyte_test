import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "@/store/userStore";
import { IconArrowLeft } from "@/components/Icons";

const FONT_SIZE_OPTIONS = [
  { label: "小", value: "small" as const },
  { label: "中", value: "normal" as const },
  { label: "大", value: "large" as const },
];

const COLOR_SCHEME_OPTIONS = [
  { label: "白色", value: "white" as const },
  { label: "蓝色", value: "blue" as const },
  { label: "薰衣草", value: "lavender" as const },
  { label: "绿色", value: "green" as const },
];

const SettingsGeneralScreen: React.FC = () => {
  const navigation = useNavigation();
  const settings = useUserStore((state) => state.settings);
  const updateSettings = useUserStore((state) => state.updateSettings);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IconArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通用设置</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>字体大小</Text>
        <View style={styles.optionsRow}>
          {FONT_SIZE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.fontSize === option.value && styles.optionButtonActive,
              ]}
              onPress={() => updateSettings({ fontSize: option.value })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.fontSize === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>颜色方案</Text>
        <View style={styles.optionsRow}>
          {COLOR_SCHEME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                settings.colorScheme === option.value && styles.optionButtonActive,
              ]}
              onPress={() => updateSettings({ colorScheme: option.value })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.colorScheme === option.value && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(0,0,0,0.5)",
    marginBottom: 12,
    marginTop: 24,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  optionButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  optionText: {
    fontSize: 15,
    color: "#000",
  },
  optionTextActive: {
    color: "#fff",
  },
});

export default SettingsGeneralScreen;