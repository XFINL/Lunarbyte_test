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

const LANGUAGE_OPTIONS = [
  { label: "中文", value: "zh" as const },
  { label: "English", value: "en" as const },
];

const SettingsLanguageScreen: React.FC = () => {
  const navigation = useNavigation();
  const language = useUserStore((state) => state.settings.language);
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
        <Text style={styles.headerTitle}>语言</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {LANGUAGE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionRow,
              language === option.value && styles.optionRowActive,
            ]}
            onPress={() => updateSettings({ language: option.value })}
          >
            <Text
              style={[
                styles.optionLabel,
                language === option.value && styles.optionLabelActive,
              ]}
            >
              {option.label}
            </Text>
            {language === option.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  optionRowActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  optionLabel: {
    fontSize: 16,
    color: "#000",
  },
  optionLabelActive: {
    color: "#fff",
  },
  checkmark: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default SettingsLanguageScreen;