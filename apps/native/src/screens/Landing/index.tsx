import { BottomSheet, Button } from "heroui-native";
import { useState } from "react";
import { Dimensions, Image, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/src/contexts/app-theme-context";
import { router } from "expo-router";

export default function Landing() {
  const insets = useSafeAreaInsets();
  const { colors, shadows, gradients, setColorTheme, toggleThemeMode } = useAppTheme();
  const screenHeight = Dimensions.get('window').height;
  const maxImageHeight = screenHeight * 0.38;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  const handleGoogleLogin = () => {
    console.log("Google login pressed");
    router.push("/onboarding");
    setIsBottomSheetOpen(false);
  };

  const handleAppleLogin = () => {
    console.log("Apple login pressed");
    setColorTheme("green");
    setIsBottomSheetOpen(false);
  };
  
  return (
    <>
      <View className="flex-1">
        {/* Beautiful gradient background */}
        <LinearGradient
          colors={colors.backgroundGradient}
          locations={gradients.backgroundLocations}
          style={StyleSheet.absoluteFill}
        />
        
        <View 
          className="flex-1"
          style={{
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 8,
          }}
        >
          <View className="flex-1 px-7 justify-between">
            {/* Top Section */}
            <View className="shrink">
              {/* Elegant Header with Logo */}
              <View className="items-center mb-6 mt-2">
                <View className="flex-row items-center gap-2.5">
                  <View 
                    className="w-9 h-9 rounded-xl items-center justify-center bg-accent/10"
                    style={shadows.sm}
                  >
                    <Image 
                      source={require("../../../assets/images/app-icon.png")} 
                      className="w-7 h-7" 
                      resizeMode="contain" 
                    />
                  </View>
                  <Text className="text-2xl font-bold tracking-tight text-accent">
                    Bloom
                  </Text>
                </View>
              </View>

              {/* Hero Image with elegant frame */}
              <View className="items-center mb-6">
                <View 
                  className="rounded-[28px] overflow-hidden w-full shadow-xl"
                  style={{ 
                    aspectRatio: 3/4, 
                    maxHeight: maxImageHeight,
                  }}
                >
                  {/* Subtle inner border effect */}
                  <View 
                    className="absolute inset-0 z-10 rounded-[28px] border border-white/60"
                  />
                  <Image
                    source={require("../../../assets/images/landing-hero.jpg")}
                    className="w-full h-full"
                    resizeMode="cover"
                    defaultSource={require("../../../assets/images/react-logo.png")}
                  />
                  {/* Soft gradient overlay at bottom for depth */}
                  <LinearGradient
                    colors={gradients.softOverlay}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30%',
                    }}
                  />
                </View>
              </View>

              {/* Title with refined typography */}
              <View className="items-center mb-4">
                <Text className="text-[15px] font-medium tracking-widest uppercase mb-2 text-accent opacity-80">
                  Your Wellness Journey
                </Text>
                <Text className="text-[32px] font-bold text-text-primary text-center leading-tight tracking-tight">
                  Thrive with{'\n'}Confidence
                </Text>
              </View>

              {/* Refined description with better spacing */}
              <Text className="text-text-secondary text-[15px] text-center leading-6 px-2">
                Track, understand, and manage your PCOS journey with a companion that truly cares about your wellbeing.
              </Text>
            </View>

            {/* Bottom Section - Elegant CTA */}
            <View className="pb-3 gap-4">
              {/* Decorative element */}
              <View className="flex-row items-center justify-center gap-2 mb-1">
                <View className="h-px w-12 bg-accent/40" />
                <View className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                <View className="h-px w-12 bg-accent/40" />
              </View>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full rounded-2xl"
                style={shadows.accent(colors.accent)}
                onPress={() => setIsBottomSheetOpen(true)}
              >
                <Button.Label className="font-bold text-[17px] tracking-wide">
                  Get Started
                </Button.Label>
              </Button>
              
              <Text className="text-text-tertiary text-xs text-center">
                Join thousands of women taking control of their health
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Login Bottom Sheet */}
      <BottomSheet isOpen={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            {/* Gradient overlay for bottom sheet */}
            <LinearGradient
              colors={colors.backgroundGradient}
              style={StyleSheet.absoluteFill}
            />
            
            <View className="px-7 pb-8 pt-2">
              {/* Decorative header flourish */}
              <View className="items-center mb-5">
                <View className="w-14 h-14 rounded-2xl items-center justify-center mb-4 bg-accent/10">
                  <Ionicons name="sparkles" size={28} color={colors.accent} />
                </View>
              </View>
              
              <BottomSheet.Title className="text-2xl font-bold text-center text-foreground mb-2">
                Welcome to Bloom
              </BottomSheet.Title>
              <BottomSheet.Description className="text-muted text-center mb-8 text-[15px] leading-5">
                Sign in to start your personalized{'\n'}wellness journey
              </BottomSheet.Description>
              
              <View className="gap-3">
                {/* Google Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full rounded-2xl bg-surface shadow-md"
                  onPress={handleGoogleLogin}
                >
                  <View className="flex-row items-center justify-center gap-3">
                    <Image 
                      source={{ uri: 'https://www.google.com/favicon.ico' }}
                      className="w-5 h-5"
                      defaultSource={require("../../../assets/images/react-logo.png")}
                    />
                    <Button.Label className="font-semibold text-foreground">
                      Continue with Google
                    </Button.Label>
                  </View>
                </Button>

                {/* Apple Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full rounded-2xl bg-black shadow-md"
                  onPress={handleAppleLogin}
                >
                  <View className="flex-row items-center justify-center gap-3">
                    <Ionicons name="logo-apple" size={20} color="#fff" />
                    <Button.Label className="font-semibold text-white">
                      Continue with Apple
                    </Button.Label>
                  </View>
                </Button>
              </View>
              
              {/* Terms text */}
              <Text className="text-muted text-xs text-center mt-6 leading-4">
                By continuing, you agree to our{' '}
                <Text className="text-accent">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-accent">Privacy Policy</Text>
              </Text>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}