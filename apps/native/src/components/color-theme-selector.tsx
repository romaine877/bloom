import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, View } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";
import { withUniwind } from "uniwind";

import { useAppTheme } from "@/src/contexts/app-theme-context";

const StyledIonicons = withUniwind(Ionicons);

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useAppTheme();

  const handleColorThemeChange = (newTheme: "purple" | "green") => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setColorTheme(newTheme);
  };

  return (
    <View className="flex-row items-center gap-2 px-2.5">
      {/* Purple Theme Button */}
      <Pressable
        onPress={() => handleColorThemeChange("purple")}
        className={`p-2 rounded-full ${
          colorTheme === "purple" ? "bg-purple-500/20" : "bg-transparent"
        }`}
      >
        <View
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: "#8c2bee" }}
        />
      </Pressable>

      {/* Green Theme Button */}
      <Pressable
        onPress={() => handleColorThemeChange("green")}
        className={`p-2 rounded-full ${
          colorTheme === "green" ? "bg-green-500/20" : "bg-transparent"
        }`}
      >
        <View
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: "#2ced6c" }}
        />
      </Pressable>
    </View>
  );
}

