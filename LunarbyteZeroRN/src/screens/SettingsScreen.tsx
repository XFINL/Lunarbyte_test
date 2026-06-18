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
import { IconArrowLeft, IconArrowRight } from "@/components/Icons";

const MENU_ITEMS = [
  {
    label: "通用设置",
    description: "字体大小、颜色方案",
    route: "SettingsGeneral" as const,
  },
  {
    label: "实验性功能",
    description: "定时关闭",
    route: "SettingsExperimental" as const,
  },
  {
    label: "语言",
    description: "中文 / English",
    route: "SettingsLanguage" as const,
  },
  {
    label: "关于",
    description: "版本信息、官方网站",
    route: "SettingsAbout" as const,
  },
];

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IconArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <IconArrowRight size={20} color="rgba(0,0,0,0.3)" />
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  menuItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: "rgba(0,0,0,0.4)",
  },
});

export default SettingsScreen;