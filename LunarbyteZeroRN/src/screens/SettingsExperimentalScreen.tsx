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

const TIMER_OPTIONS = [
  { label: "关闭", value: 0 },
  { label: "15 分钟", value: 15 },
  { label: "30 分钟", value: 30 },
  { label: "45 分钟", value: 45 },
  { label: "60 分钟", value: 60 },
];

const SettingsExperimentalScreen: React.FC = () => {
  const navigation = useNavigation();
  const timerMinutes = useUserStore((state) => state.settings.timerMinutes);
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
        <Text style={styles.headerTitle}>实验性功能</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>定时关闭</Text>
        {TIMER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionRow,
              timerMinutes === option.value && styles.optionRowActive,
            ]}
            onPress={() => updateSettings({ timerMinutes: option.value })}
          >
            <Text
              style={[
                styles.optionLabel,
                timerMinutes === option.value && styles.optionLabelActive,
              ]}
            >
              {option.label}
            </Text>
            {timerMinutes === option.value && (
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(0,0,0,0.5)",
    marginBottom: 12,
    marginTop: 24,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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

export default SettingsExperimentalScreen;