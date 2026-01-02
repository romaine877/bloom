import { useMemo, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { useAppTheme } from "@/src/contexts/app-theme-context";
import { type ThemeColors } from "@/src/theme/colors";
import { PressableFeedback, ScrollShadow } from "heroui-native";
import { router } from "expo-router";

const moods = [
  { id: "happy", label: "Happy", icon: "happy-outline" as const },
  { id: "energetic", label: "Energetic", icon: "flash-outline" as const },
  { id: "bloated", label: "Bloated", icon: "sad-outline" as const },
  { id: "tired", label: "Tired", icon: "moon-outline" as const },
  { id: "calm", label: "Calm", icon: "leaf-outline" as const },
  { id: "anxious", label: "Anxious", icon: "sad-outline" as const },
];

const actions = [
  { id: "cycle", title: "Cycle Log", subtitle: "Day 14", caption: "Ovulation Phase", icon: "water-outline" as const, tint: "#ef4444" },
  { id: "symptoms", title: "Symptoms", subtitle: "Log symptoms", caption: "", icon: "medkit-outline" as const, tint: "#6366f1" },
  { id: "meals", title: "Meal Diary", subtitle: "2/3", caption: "", icon: "restaurant-outline" as const, tint: "#22c55e" },
  { id: "weight", title: "Weight", subtitle: "Last: 7d ago", caption: "", icon: "scale-outline" as const, tint: "#f59e0b" },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colors, gradients } = useAppTheme();
  const [selectedMood, setSelectedMood] = useState<string>("happy");

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = useMemo(() => (screenWidth - 48 - 12) / 2, [screenWidth]); // px-6 padding on each side (24*2) + gap-3 (12)

  const handleMoodSelect = (id: string) => setSelectedMood(id);

  return (
    <View className="flex-1">
      {/* Soft background gradient */}
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={gradients.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      <ScrollShadow LinearGradientComponent={LinearGradient} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 18,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 pb-6 gap-7">
            {/* Header */}
            <View className="px-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-13 h-13 rounded-[18px] items-center justify-center" style={{ backgroundColor: colors.accentSoft }}>
                    <Image
                      source={require("@/assets/images/app-icon.png")}
                      className="w-11 h-11 rounded-2xl"
                      resizeMode="contain"
                    />
                    <View
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: "#2ced6c", borderColor: colors.surface }}
                    />
                  </View>
                  <View>
                    <Text className="text-[15px] font-medium text-text-secondary">Good morning,</Text>
                    <Text className="text-[26px] font-extrabold text-text-primary leading-tight">Sarah</Text>
                  </View>
                </View>
                <PressableFeedback onPress={() => router.push("/settings")}>
                  <View className="w-12 h-12 rounded-full bg-surface items-center justify-center shadow-md">
                    <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
                  </View>
                </PressableFeedback>
              </View>
            </View>

            {/* Mood selector */}
            <View>
              <Text className="px-6 text-[26px] font-bold text-text-primary mb-4 leading-tight ">
                How are you feeling today?
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14, paddingRight: 6 }}
              >
                {moods.map((mood) => {
                  const isActive = selectedMood === mood.id;
                  return (
                    <Pressable
                      key={mood.id}
                      className="items-center"
                      style={{ minWidth: 76 }}
                      onPress={() => handleMoodSelect(mood.id)}
                    >
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: isActive ? colors.accent : colors.surface,
                          shadowColor: colors.accent,
                          shadowOffset: { width: 0, height: isActive ? 6 : 2 },
                          shadowOpacity: isActive ? 0.28 : 0.08,
                          shadowRadius: isActive ? 12 : 6,
                          elevation: isActive ? 8 : 2,
                          borderWidth: isActive ? 0 : 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Ionicons
                          name={mood.icon}
                          size={30}
                          color={isActive ? colors.accentForeground : colors.textSecondary}
                        />
                      </View>
                      <Text
                        className={isActive ? "mt-2 text-accent font-semibold" : "mt-2 text-muted font-medium"}
                        style={{ fontSize: 15 }}
                      >
                        {mood.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Daily Insight */}
            <View className="px-6">
              <View className="rounded-3xl overflow-hidden bg-[#efe9fa] shadow-lg">
           
                <View className="p-6 gap-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="bulb-outline" size={20} color={colors.textAccent} />
                    <Text className="text-[13px] font-semibold tracking-widest uppercase text-textAccent">
                      Daily Insight
                    </Text>
                  </View>
                  <Text className="text-[22px] font-bold text-text-primary leading-7">
                    Spearmint tea may help lower androgen levels naturally.
                  </Text>
                  <Text className="text-[16px] leading-6 text-text-secondary">
                    Studies suggest two cups a day can assist with hormonal balance and reduce symptoms.
                  </Text>
                  <Pressable className="flex-row items-center gap-1" onPress={() => console.log("Read article")}>
                    <Text className="text-[16px] font-bold" style={{ color: colors.accent }}>
                      Read article
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.accent} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Daily Actions */}
            <View className="px-6 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[22px] font-bold text-text-primary">Daily Actions</Text>
                <Text className="text-[16px] font-semibold" style={{ color: colors.accent }}>
                  Edit
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-3">
                {actions.map((action) => (
                  <Pressable key={action.id} style={{ width: cardWidth }}>
                    <View className="rounded-[26px] bg-surface p-4 gap-3 shadow-md">
                      <View
                        className="w-11 h-11 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: `${action.tint}1A` }}
                      >
                        <Ionicons name={action.icon} size={22} color={action.tint} />
                      </View>
                      <View className="gap-1">
                        <Text className="text-[18px] font-bold text-text-primary">{action.title}</Text>
                        {action.subtitle !== "" && (
                          <View className="flex-row items-center gap-2">
                            <Text className="text-[15px] font-semibold text-text-primary">{action.subtitle}</Text>
                            {action.id === "meals" && (
                              <View className="flex-1 h-2 rounded-full bg-default/50">
                                <View
                                  className="h-full rounded-full"
                                  style={{ width: "66%", backgroundColor: action.tint }}
                                />
                              </View>
                            )}
                          </View>
                        )}
                        {action.caption !== "" && (
                          <Text className="text-[14px] text-muted">{action.caption}</Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Daily Goals */}
            <View className="px-6">
              <View className="rounded-[28px] bg-surface p-5 shadow-md gap-3">
                <Text className="text-[22px] font-extrabold text-text-primary">Daily Goals</Text>
                <Text className="text-[15px] text-text-secondary">Keep up the good work!</Text>
                <View className="flex-row gap-6">
                  <GoalRing label="Water" value={0.8} colors={colors} tint={colors.accent} />
                  <GoalRing label="Steps" value={0.32} colors={colors} tint="#22c55e" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollShadow>
    </View>
  );
}

type GoalRingProps = {
  label: string;
  value: number; // 0 - 1
  tint: string;
  colors: ThemeColors;
};

function GoalRing({ label, value, colors, tint }: GoalRingProps) {
  const percent = Math.round(value * 100);
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-20 h-20 items-center justify-center">
        <View className="absolute inset-0 rounded-full items-center justify-center">
          <View
            className="w-full h-full rounded-full items-center justify-center"
            style={{
              borderWidth: 8,
              borderColor: `${tint}1F`,
            }}
          />
          <View
            className="absolute inset-0 rounded-full"
            style={{
              borderWidth: 8,
              borderColor: tint,
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              transform: [{ rotate: `${value * 360}deg` }],
              opacity: 0.9,
            }}
          />
        </View>
        <View className="w-12 h-12 rounded-full bg-surface items-center justify-center shadow-sm">
          <Text className="text-[13px] font-bold text-text-primary">{percent}%</Text>
        </View>
      </View>
      <View>
        <Text className="text-[16px] font-semibold text-text-primary">{label}</Text>
        <Text className="text-[13px] text-text-secondary">
          {label === "Water" ? "6 of 8 glasses" : "3,200 of 10,000 steps"}
        </Text>
      </View>
    </View>
  );
}