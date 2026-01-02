import { cn } from "heroui-native";
import { type PropsWithChildren } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/src/contexts/app-theme-context";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
  className?: string;
};

export function Container({ children, className, ...props }: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();
  const { colorTheme } = useAppTheme();

  // Define subtle accent tints for each theme (very low opacity to blend with background)
  const accentTints = {
    purple: "rgba(140, 43, 238, 0.015)",
    green: "rgba(44, 237, 108, 0.015)",
  };

  return (
    <AnimatedView
      className={cn("flex-1 bg-background", className)}
      style={{
        paddingBottom: insets.bottom,
      }}
      {...props}
    >
      {/* Subtle accent tint overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: accentTints[colorTheme],
          pointerEvents: "none",
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
    </AnimatedView>
  );
}
