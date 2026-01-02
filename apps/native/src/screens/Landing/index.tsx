import { BottomSheet, Button } from "heroui-native";
import { useState } from "react";
import { Dimensions, Image, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/src/contexts/app-theme-context";

export default function Landing() {
  const insets = useSafeAreaInsets();
  const { colorTheme } = useAppTheme();
  const screenHeight = Dimensions.get('window').height;
  const maxImageHeight = screenHeight * 0.38;
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Theme-aware colors
  const accentColor = colorTheme === "purple" ? "#8c2bee" : "#2ced6c";
  const accentColorLight = colorTheme === "purple" ? "#c084fc" : "#86efac";
  const accentColorSoft = colorTheme === "purple" ? "rgba(140, 43, 238, 0.08)" : "rgba(44, 237, 108, 0.08)";
  
  // Gradient colors - warm, nurturing tones
  const gradientColors = colorTheme === "purple" 
    ? ['#FDF8FF', '#FBF4FF', '#F8EFFC', '#FDF8FF'] as const
    : ['#F8FFFA', '#F4FFF7', '#EFFCF3', '#F8FFFA'] as const;
  
  const handleGoogleLogin = () => {
    console.log("Google login pressed");
    setIsBottomSheetOpen(false);
  };

  const handleAppleLogin = () => {
    console.log("Apple login pressed");
    setIsBottomSheetOpen(false);
  };
  
  return (
    <>
      <View className="flex-1">
        {/* Beautiful gradient background */}
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.3, 0.7, 1]}
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
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ 
                      backgroundColor: accentColorSoft,
                      shadowColor: accentColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                    }}
                  >
                    <Image 
                      source={require("../../../assets/images/app-icon.png")} 
                      className="w-7 h-7" 
                      resizeMode="contain" 
                    />
                  </View>
                  <Text 
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: accentColor }}
                  >
                    Bloom
                  </Text>
                </View>
              </View>

              {/* Hero Image with elegant frame */}
              <View className="items-center mb-6">
                <View 
                  className="rounded-[28px] overflow-hidden w-full"
                  style={{ 
                    aspectRatio: 3/4, 
                    maxHeight: maxImageHeight,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    elevation: 12,
                  }}
                >
                  {/* Subtle inner border effect */}
                  <View 
                    className="absolute inset-0 z-10 rounded-[28px]"
                    style={{
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.6)',
                    }}
                  />
                  <Image
                    source={require("../../../assets/images/landing-hero.jpg")}
                    className="w-full h-full"
                    resizeMode="cover"
                    defaultSource={require("../../../assets/images/react-logo.png")}
                  />
                  {/* Soft gradient overlay at bottom for depth */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.03)']}
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
                <Text 
                  className="text-[15px] font-medium tracking-widest uppercase mb-2"
                  style={{ color: accentColor, opacity: 0.8 }}
                >
                  Your Wellness Journey
                </Text>
                <Text className="text-[32px] font-bold text-gray-900 text-center leading-tight tracking-tight">
                  Thrive with{'\n'}Confidence
                </Text>
              </View>

              {/* Refined description with better spacing */}
              <Text className="text-gray-500 text-[15px] text-center leading-6 px-2">
                Track, understand, and manage your PCOS journey with a companion that truly cares about your wellbeing.
              </Text>
            </View>

            {/* Bottom Section - Elegant CTA */}
            <View className="pb-3 gap-4">
              {/* Decorative element */}
              <View className="flex-row items-center justify-center gap-2 mb-1">
                <View 
                  className="h-px w-12"
                  style={{ backgroundColor: accentColorLight, opacity: 0.4 }}
                />
                <View 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentColorLight, opacity: 0.6 }}
                />
                <View 
                  className="h-px w-12"
                  style={{ backgroundColor: accentColorLight, opacity: 0.4 }}
                />
              </View>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full rounded-2xl"
                style={{
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
                onPress={() => setIsBottomSheetOpen(true)}
              >
                <Button.Label className="font-bold text-[17px] tracking-wide">
                  Get Started
                </Button.Label>
              </Button>
              
              <Text className="text-gray-400 text-xs text-center">
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
          <BottomSheet.Content >
            {/* Gradient overlay for bottom sheet */}
            <LinearGradient
              colors={gradientColors}
              style={StyleSheet.absoluteFill}
            />
            
            <View className="px-7 pb-8 pt-2">
              {/* Decorative header flourish */}
              <View className="items-center mb-5">
          
                <View 
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: accentColorSoft,
                  }}
                >
                  <Ionicons name="sparkles" size={28} color={accentColor} />
                </View>
              </View>
              
              <BottomSheet.Title className="text-2xl font-bold text-center text-gray-900 mb-2">
                Welcome to Bloom
              </BottomSheet.Title>
              <BottomSheet.Description className="text-gray-500 text-center mb-8 text-[15px] leading-5">
                Sign in to start your personalized{'\n'}wellness journey
              </BottomSheet.Description>
              
              <View className="gap-3">
                {/* Google Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full rounded-2xl"
                  style={{
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                  onPress={handleGoogleLogin}
                >
                  <View className="flex-row items-center justify-center gap-3">
                    <Image 
                      source={{ uri: 'https://www.google.com/favicon.ico' }}
                      className="w-5 h-5"
                      defaultSource={require("../../../assets/images/react-logo.png")}
                    />
                    <Button.Label className="font-semibold text-gray-700">
                      Continue with Google
                    </Button.Label>
                  </View>
                </Button>

                {/* Apple Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full rounded-2xl"
                  style={{
                    backgroundColor: '#000',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
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
              <Text className="text-gray-400 text-xs text-center mt-6 leading-4">
                By continuing, you agree to our{' '}
                <Text style={{ color: accentColor }}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={{ color: accentColor }}>Privacy Policy</Text>
              </Text>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}