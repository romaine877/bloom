import { BottomSheet, Button } from "heroui-native";
import { useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/src/contexts/app-theme-context";

export default function Landing() {
  const insets = useSafeAreaInsets();
  const { colorTheme } = useAppTheme();
  const screenHeight = Dimensions.get('window').height;
  const maxImageHeight = screenHeight * 0.4; // Max 40% of screen height
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Define subtle accent tints for backgrounds
  const backgroundTint = colorTheme === "purple" 
    ? "rgba(140, 43, 238, 0.015)" 
    : "rgba(44, 237, 108, 0.015)";
  
  // Slightly stronger tint for overlays/bottom sheets
  const overlayTint = colorTheme === "purple"
    ? "rgba(140, 43, 238, 0.025)"
    : "rgba(44, 237, 108, 0.025)";
  
  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log("Google login pressed");
    setIsBottomSheetOpen(false);
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple login
    console.log("Apple login pressed");
    setIsBottomSheetOpen(false);
  };
  
  return (
    <>
      <View 
        className="flex-1 bg-white"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Subtle accent tint overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: backgroundTint,
            pointerEvents: "none",
          }}
        />
        <View className="flex-1 px-6 pt-4 pb-4 justify-between">
          {/* Top Section */}
          <View className="shrink">
            {/* Header with Logo */}
            <View className="items-center mb-3">
              <View className="flex-row items-center gap-2">
                {/* Logo Icon - Replace with actual logo image */}
                {/* Add your logo image to: apps/native/assets/images/bloom-logo.png */}
                <View className="w-8 h-8  rounded-lg items-center justify-center">
                  <Image source={require("../../../assets/images/app-icon.png")} className="w-full h-full" resizeMode="contain" />
                </View>
                <Text className="text-accent text-2xl font-bold" >Bloom</Text>
              </View>
            </View>

            {/* Central Image with Overlay Text */}
            <View className="items-center mb-3">
              <View className="rounded-3xl overflow-hidden shadow-lg bg-muted/20 w-full relative" style={{ aspectRatio: 3/4, maxHeight: maxImageHeight }}>
                {/* 
                  Add your hero image to: apps/native/assets/images/landing-hero.png
                  The image should show a woman in a yoga pose with plants in the background
                */}
                <Image
                  source={require("../../../assets/images/landing-hero.jpg")}
                  className="w-full h-full"
                  resizeMode="cover"
                  // Fallback placeholder - replace with actual image
                  defaultSource={require("../../../assets/images/react-logo.png")}
                />
                {/* Overlay "Thrive with" text on bottom of image */}
          
              </View>
            </View>

            {/* Title - "Confidence" below image */}
            <Text className="text-3xl font-bold text-black text-center mb-2">
          Thrive with Confidence
          </Text>

          {/* Description */}
          <Text className="text-muted text-sm text-center mb-4 leading-5 font-normal">
              Track, understand, gg and manage your{'\n'}PCOS journey with a companion that{'\n'}cares.
            </Text>
          </View>

          {/* Bottom Section - Action Buttons */}
          <View className="gap-3 pb-2">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full"
              onPress={() => setIsBottomSheetOpen(true)}
            >
              <Button.Label className="font-bold">Log In</Button.Label>
            </Button>
          </View>
        </View>
      </View>

      {/* Login Bottom Sheet */}
      <BottomSheet isOpen={isBottomSheetOpen}  onOpenChange={setIsBottomSheetOpen}>
        <BottomSheet.Portal>
          {/* Apply subtle tint to the backdrop overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayTint,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <BottomSheet.Overlay />
          <BottomSheet.Content>
            {/* Subtle accent tint overlay for bottom sheet content */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: overlayTint,
                pointerEvents: "none",
              }}
            />
            <View className="px-6 pb-6 pt-4">
           
              <BottomSheet.Title className="text-2xl font-bold text-center mb-2">
                Welcome Back
              </BottomSheet.Title>
              <BottomSheet.Description className="text-muted text-center mb-6">
                Choose your preferred login method
              </BottomSheet.Description>
              
              <View className="gap-3">
                {/* Google Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full"
                  onPress={handleGoogleLogin}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                    <Button.Label className="font-semibold">Continue with Google</Button.Label>
                  </View>
                </Button>

                {/* Apple Login Button */}
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full"
                  onPress={handleAppleLogin}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="logo-apple" size={20} color="#000000" />
                    <Button.Label className="font-semibold">Continue with Apple</Button.Label>
                  </View>
                </Button>
              </View>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}