import { Button, Card } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/src/components/container";
import { ColorThemeSelector } from "@/src/components/color-theme-selector";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { useAppTheme } from "@/src/contexts/app-theme-context";

export default function Home() {
  const { colorTheme } = useAppTheme();

  return (
    <Container className="p-6">
      <View className="flex-1">
        {/* Theme Controls */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-4">
            <Text className="text-foreground text-sm font-medium">Color Theme:</Text>
            <ColorThemeSelector />
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-foreground text-sm font-medium">Mode:</Text>
            <ThemeToggle />
          </View>
        </View>

        {/* Demo Content */}
        <View className="flex-1 justify-center items-center gap-6">
          <Card variant="secondary" className="p-8 items-center w-full">
            <Card.Title className="text-3xl mb-2">Tab One</Card.Title>
            <Text className="text-muted text-center mb-4">
              Current color theme: {colorTheme}
            </Text>
            
            {/* Accent Color Demo */}
            <View className="w-full gap-3">
              <View className="bg-accent rounded-lg p-4 items-center">
                <Text className="text-accent-foreground font-semibold">
                  Accent Background
                </Text>
              </View>
              <Button variant="primary" size="lg" className="w-full">
                <Button.Label>Primary Button</Button.Label>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </Container>
  );
}
