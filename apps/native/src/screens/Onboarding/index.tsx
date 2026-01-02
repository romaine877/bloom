import { Button, ScrollShadow, cn } from "heroui-native";
import { useState } from "react";
import { Dimensions, Image, Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/src/contexts/app-theme-context";
import { router } from "expo-router";

type Goal = "fertility" | "weight" | "skin" | "mental";
type Symptom = "irregular" | "fatigue" | "acne" | "mood" | "cravings";

const goals: { id: Goal; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "fertility", label: "Fertility Journey", icon: "heart" },
  { id: "weight", label: "Weight Mgmt", icon: "scale" },
  { id: "skin", label: "Skin Health", icon: "happy" },
  { id: "mental", label: "Mental Balance", icon: "leaf" },
];

const symptoms: { id: Symptom; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "irregular", label: "Irregular Cycles", icon: "sync" },
  { id: "fatigue", label: "Fatigue", icon: "flash" },
  { id: "acne", label: "Acne", icon: "ellipse" },
  { id: "mood", label: "Mood Swings", icon: "sad" },
  { id: "cravings", label: "Cravings", icon: "restaurant" },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { colors, shadows, gradients } = useAppTheme();
  const screenWidth = Dimensions.get("window").width;

  const [selectedGoal, setSelectedGoal] = useState<Goal>("fertility");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(["irregular", "cravings"]);

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleContinue = () => {
    console.log("Continue pressed", { selectedGoal, selectedSymptoms });
    router.push("/dashboard");
  };

  const handleBack = () => {
    console.log("Back pressed");
  };

  const handleSkip = () => {
    console.log("Skip pressed");
  };

  // Calculate card width for 2-column grid with gap
  const cardWidth = (screenWidth - 56 - 12) / 2; // 56px total horizontal padding (28*2), 12px gap

  return (
    <View className="flex-1">
      {/* Beautiful gradient background */}
      <LinearGradient
        colors={colors.backgroundGradient}
        locations={gradients.backgroundLocations}
        style={StyleSheet.absoluteFill}
      />

      <ScrollShadow LinearGradientComponent={LinearGradient} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Card */}
          <View className="px-7 mb-6">
            <View
              className="rounded-[28px] overflow-hidden bg-gray-900 shadow-lg"
              style={{ height: 180 }}
            >
              <Image
                source={require("@/assets/images/landing-hero.jpg")}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Dark overlay for text readability */}
              <LinearGradient
                colors={gradients.imageOverlay}
                locations={gradients.imageOverlayLocations}
                style={StyleSheet.absoluteFill}
              />
              <View className="absolute bottom-0 left-0 right-0 p-6">
                <Text className="text-[26px] font-bold text-white leading-tight tracking-tight">
                  Your Journey to{"\n"}Balance starts here.
                </Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View className="px-7">
            {/* Headline */}
            <Text className="text-[28px] font-bold mb-2 leading-tight tracking-tight text-accent">
              Let's personalize your care
            </Text>
            <Text className="text-[15px] leading-6 mb-6 text-muted font-normal">
              We're here to help you manage PCOS with confidence. Tell us what matters most to you
              right now.
            </Text>

            {/* Choose Your Main Goal Section */}
            <Text className="text-[12px] font-semibold tracking-widest uppercase mb-3 text-muted ">
              Choose your main goal
            </Text>

            {/* Goals Grid - 2x2 */}
            <View className="flex-row flex-wrap gap-3 mb-8">
              {goals.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <Pressable
                    key={goal.id}
                    onPress={() => setSelectedGoal(goal.id)}
                    style={{ width: cardWidth }}
                  >
                    <View
                      className={cn(
                        "rounded-2xl p-4 items-center justify-center bg-surface shadow-md",
                        isSelected && "border-2 border-accent"
                      )}
                      style={{ height: 110 }}
                    >
                      {/* Selection Checkmark */}
                      {isSelected && (
                        <View className="absolute top-2 right-2 w-5 h-5 rounded-full items-center justify-center bg-accent">
                          <Ionicons name="checkmark" size={14} color={colors.textInverse} />
                        </View>
                      )}

                      {/* Icon */}
                      <View
                        className={cn(
                          "w-12 h-12 rounded-xl items-center justify-center mb-2",
                          isSelected ? "bg-accent/10" : "bg-default"
                        )}
                      >
                        <Ionicons
                          name={goal.icon}
                          size={24}
                          color={isSelected ? colors.accent : colors.muted}
                        />
                      </View>

                      <Text
                        className={cn(
                          "text-[13px] font-semibold text-center",
                          isSelected ? "text-foreground" : "text-muted"
                        )}
                      >
                        {goal.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* What Are You Experiencing Section */}
            <Text className="text-[12px] font-semibold tracking-widest uppercase mb-3 text-muted">
              What are you experiencing?
            </Text>

            {/* Symptom Chips */}
            <View className="flex-row flex-wrap gap-2 mb-8">
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <Pressable key={symptom.id} onPress={() => toggleSymptom(symptom.id)}>
                    <View
                      className={cn(
                        "flex-row items-center gap-2 px-4 py-3 rounded-full shadow-sm",
                        isSelected ? "bg-accent" : "bg-surface"
                      )}
                    >
                      <Ionicons
                        name={symptom.icon}
                        size={16}
                        color={isSelected ? colors.accentForeground : colors.muted}
                      />
                      <Text
                        className={cn(
                          "text-[14px] font-medium",
                          isSelected ? "text-accent-foreground" : "text-foreground"
                        )}
                      >
                        {symptom.label}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View className="px-7 pb-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-2xl"
              style={shadows.accent(colors.accent)}
              onPress={handleContinue}
            >
              <View className="flex-row items-center justify-center gap-2">
                <Button.Label className="font-bold text-[17px] tracking-wide">Continue</Button.Label>
                <Ionicons name="arrow-forward" size={20} color={colors.textInverse} />
              </View>
            </Button>
          </View>
        </ScrollView>
      </ScrollShadow>
    </View>
  );
}
