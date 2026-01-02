import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollShadow } from "heroui-native";
import { router } from "expo-router";

import { useAppTheme } from "@/src/contexts/app-theme-context";
import { type ColorTheme, type ThemeColors } from "@/src/theme/colors";

type SettingToggleProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

type SettingLinkProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
};

type ThemeChipProps = {
  id: ColorTheme;
  label: string;
  color: string;
  isActive: boolean;
  onSelect: (theme: ColorTheme) => void;
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, gradients, colorTheme, themeMode, setColorTheme, toggleThemeMode } = useAppTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [cycleReminders, setCycleReminders] = useState(true);
  const [dailyInsights, setDailyInsights] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const themeChips: ThemeChipProps[] = useMemo(
    () => [
      { id: "purple", label: "Purple", color: "#8c2bee", isActive: colorTheme === "purple", onSelect: setColorTheme },
      { id: "green", label: "Green", color: "#2ced6c", isActive: colorTheme === "green", onSelect: setColorTheme },
      { id: "neonBlue", label: "Neon Blue", color: "#00D4FF", isActive: colorTheme === "neonBlue", onSelect: setColorTheme },
    ],
    [colorTheme, setColorTheme],
  );

  return (
    <View className="flex-1">
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={gradients.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      <ScrollShadow LinearGradientComponent={LinearGradient} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-7 gap-6">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <Pressable
                className="w-11 h-11 rounded-full bg-surface items-center justify-center shadow-md"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
              </Pressable>
              <View className="items-center flex-1">
                <Text className="text-[20px] font-bold text-text-primary">Settings</Text>
                <Text className="text-[13px] text-muted">Keep your experience personal</Text>
              </View>
              <View className="w-11" />
            </View>

            {/* Profile */}
            <View className="rounded-3xl bg-surface p-5 shadow-md flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-2xl bg-accent/10 items-center justify-center shadow-sm">
                <Image
                  source={require("@/assets/images/app-icon.png")}
                  className="w-12 h-12 rounded-xl"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[17px] font-bold text-text-primary">Sarah Thompson</Text>
                <Text className="text-[14px] text-text-secondary">sarah.thompson@email.com</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="px-3 py-1 rounded-full bg-accent/10">
                    <Text className="text-[12px] font-semibold text-textAccent">PCOS Focused</Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-default/80">
                    <Text className="text-[12px] font-semibold text-text-primary">Premium</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>

            {/* Notifications */}
            <View className="rounded-3xl bg-surface p-5 shadow-md gap-4">
              <SectionHeader title="Notifications" subtitle="Stay on top of your journey" colors={colors} />
              <SettingToggleRow
                icon="notifications-outline"
                label="Push notifications"
                description="General tips, insights, and progress updates"
                value={pushEnabled}
                onChange={setPushEnabled}
                colors={colors}
              />
              <SettingToggleRow
                icon="calendar-outline"
                label="Cycle reminders"
                description="Track fertile window, ovulation, and period"
                value={cycleReminders}
                onChange={setCycleReminders}
                colors={colors}
              />
              <SettingToggleRow
                icon="bulb-outline"
                label="Daily insights"
                description="Personalized guidance for your goals"
                value={dailyInsights}
                onChange={setDailyInsights}
                colors={colors}
              />
              <SettingToggleRow
                icon="volume-high-outline"
                label="Sound & haptics"
                description="Play gentle chimes and vibrations"
                value={soundEnabled}
                onChange={setSoundEnabled}
                colors={colors}
              />
            </View>

            {/* Appearance */}
            <View className="rounded-3xl bg-surface p-5 shadow-md gap-4">
              <SectionHeader title="Appearance" subtitle="Match your vibe" colors={colors} />
              <View className="flex-row gap-3">
                {themeChips.map((chip) => (
                  <ThemeChip key={chip.id} {...chip} colors={colors} />
                ))}
              </View>
              <SettingToggleRow
                icon="moon-outline"
                label="Dark mode"
                description="Dim the lights for evening use"
                value={themeMode === "dark"}
                onChange={() => toggleThemeMode()}
                colors={colors}
              />
            </View>

            {/* Data & Support */}
            <View className="rounded-3xl bg-surface p-5 shadow-md gap-4">
              <SectionHeader title="Data & Support" subtitle="Manage your account" colors={colors} />
              <SettingLinkRow
                icon="lock-closed-outline"
                label="Privacy & permissions"
                description="Data sharing, backups, and security"
                onPress={() => console.log("Navigate to privacy")}
                colors={colors}
              />
              <SettingLinkRow
                icon="help-circle-outline"
                label="Help & support"
                description="FAQs, chat with support, resources"
                onPress={() => console.log("Navigate to support")}
                colors={colors}
              />
              <SettingLinkRow
                icon="exit-outline"
                label="Sign out"
                description="You can sign back in anytime"
                onPress={() => console.log("Sign out")}
                colors={colors}
              />
            </View>
          </View>
        </ScrollView>
      </ScrollShadow>
    </View>
  );
}

function SectionHeader({ title, subtitle, colors }: { title: string; subtitle: string; colors: ThemeColors }) {
  return (
    <View className="gap-1">
      <Text className="text-[17px] font-bold text-text-primary">{title}</Text>
      <Text className="text-[14px] text-text-secondary">{subtitle}</Text>
    </View>
  );
}

function SettingToggleRow({ icon, label, description, value, onChange, colors }: SettingToggleProps & { colors: ThemeColors }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-11 h-11 rounded-2xl items-center justify-center bg-accent/10">
        <Ionicons name={icon} size={20} color={colors.accent} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text-primary">{label}</Text>
        <Text className="text-[13px] text-text-secondary">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={value ? colors.accentForeground : colors.surface}
      />
    </View>
  );
}

function SettingLinkRow({ icon, label, description, onPress, colors }: SettingLinkProps & { colors: ThemeColors }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 active:opacity-80">
      <View className="w-11 h-11 rounded-2xl items-center justify-center bg-default/90">
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text-primary">{label}</Text>
        <Text className="text-[13px] text-text-secondary">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function ThemeChip({ id, label, color, isActive, onSelect, colors }: ThemeChipProps & { colors: ThemeColors }) {
  return (
    <Pressable
      onPress={() => onSelect(id)}
      className="flex-1 rounded-2xl p-3 items-center gap-2"
      style={{
        borderWidth: isActive ? 2 : 1,
        borderColor: isActive ? colors.accent : colors.border,
        backgroundColor: isActive ? colors.accentSoft : colors.surface,
      }}
    >
      <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
        <Ionicons name="color-palette-outline" size={20} color={color} />
      </View>
      <Text className="text-[14px] font-semibold text-text-primary">{label}</Text>
      {isActive && <Text className="text-[12px] text-textAccent">Active</Text>}
    </Pressable>
  );
}
