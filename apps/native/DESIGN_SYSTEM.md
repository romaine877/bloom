# Bloom Design System

A design guide for maintaining visual consistency across the Bloom app — a wellness companion designed for women managing their PCOS journey.

---

## Brand Identity

### Core Values
- **Nurturing**: Warm, supportive, and caring
- **Empowering**: Confident, uplifting, and encouraging
- **Elegant**: Clean, refined, and sophisticated
- **Calming**: Soft, peaceful, and reassuring

---

## Color Palette

### Theme-Aware Accent Colors

The app supports two color themes: **Purple** (default) and **Green**.

```typescript
// Primary accent
const accentColor = colorTheme === "purple" ? "#8c2bee" : "#2ced6c";

// Light accent (for decorative elements)
const accentColorLight = colorTheme === "purple" ? "#c084fc" : "#86efac";

// Soft accent (for subtle backgrounds, 8% opacity)
const accentColorSoft = colorTheme === "purple" 
  ? "rgba(140, 43, 238, 0.08)" 
  : "rgba(44, 237, 108, 0.08)";
```

### Background Gradients

Use warm, nurturing gradient tones for main backgrounds:

```typescript
const gradientColors = colorTheme === "purple" 
  ? ['#FDF8FF', '#FBF4FF', '#F8EFFC', '#FDF8FF'] as const
  : ['#F8FFFA', '#F4FFF7', '#EFFCF3', '#F8FFFA'] as const;

// Usage with expo-linear-gradient
<LinearGradient
  colors={gradientColors}
  locations={[0, 0.3, 0.7, 1]}
  style={StyleSheet.absoluteFill}
/>
```

### Text Colors

| Usage | Color | Class/Style |
|-------|-------|-------------|
| Headlines | Near black | `text-gray-900` |
| Body text | Medium gray | `text-gray-500` |
| Subtle/Caption | Light gray | `text-gray-400` |
| Accent text | Theme accent | `style={{ color: accentColor }}` |
| Links/Interactive | Theme accent | `style={{ color: accentColor }}` |

---

## Typography

### Font Weights
- **Bold** (`font-bold`): Headlines, CTAs, emphasis
- **Semibold** (`font-semibold`): Button labels, important text
- **Medium** (`font-medium`): Subtitles, labels
- **Normal** (`font-normal`): Body text

### Type Scale

| Element | Size | Weight | Additional Styles |
|---------|------|--------|-------------------|
| Screen Title | `text-[32px]` | Bold | `leading-tight tracking-tight` |
| Section Title | `text-2xl` | Bold | — |
| Subtitle/Label | `text-[15px]` | Medium | `tracking-widest uppercase` |
| Body | `text-[15px]` | Normal | `leading-6` |
| Button Label | `text-[17px]` | Bold | `tracking-wide` |
| Caption | `text-xs` | Normal | `leading-4` |

### Typography Examples

```tsx
// Screen headline
<Text className="text-[32px] font-bold text-gray-900 text-center leading-tight tracking-tight">
  Thrive with{'\n'}Confidence
</Text>

// Accent subtitle/label
<Text 
  className="text-[15px] font-medium tracking-widest uppercase mb-2"
  style={{ color: accentColor, opacity: 0.8 }}
>
  Your Wellness Journey
</Text>

// Body text
<Text className="text-gray-500 text-[15px] text-center leading-6 px-2">
  Track, understand, and manage your PCOS journey with a companion that truly cares.
</Text>

// Caption/Fine print
<Text className="text-gray-400 text-xs text-center leading-4">
  By continuing, you agree to our Terms
</Text>
```

---

## Spacing

### Container Padding
- **Horizontal**: `px-7` (28px) for main content areas
- **Safe areas**: Always respect safe area insets with additional padding

```tsx
style={{
  paddingTop: insets.top + 8,
  paddingBottom: insets.bottom + 8,
}}
```

### Vertical Rhythm
- `mb-2`: Small spacing (8px)
- `mb-4`: Medium spacing (16px)
- `mb-5`: Comfortable spacing (20px)
- `mb-6`: Section spacing (24px)
- `mb-8`: Large section spacing (32px)

### Gap Utilities
- `gap-2`: Tight groupings
- `gap-3`: Button groups, lists
- `gap-4`: Section separations

---

## Border Radius

| Element | Radius | Class |
|---------|--------|-------|
| Small buttons/badges | 12px | `rounded-xl` |
| Buttons | 16px | `rounded-2xl` |
| Cards | 24px | `rounded-3xl` |
| Hero images | 28px | `rounded-[28px]` |
| Icon containers | 12-16px | `rounded-xl` to `rounded-2xl` |

---

## Shadows

### Accent-Tinted Shadows (Primary CTAs)

```tsx
style={{
  shadowColor: accentColor,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 8,
}}
```

### Subtle Shadows (Secondary elements)

```tsx
style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
}}
```

### Deep Shadows (Cards, Hero images)

```tsx
style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 12,
}}
```

### Logo/Icon Container Shadow

```tsx
style={{ 
  backgroundColor: accentColorSoft,
  shadowColor: accentColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
}}
```

---

## Components

### Primary Button

```tsx
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
  onPress={handlePress}
>
  <Button.Label className="font-bold text-[17px] tracking-wide">
    Get Started
  </Button.Label>
</Button>
```

### Secondary Button (Light)

```tsx
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
  onPress={handlePress}
>
  <View className="flex-row items-center justify-center gap-3">
    <Ionicons name="logo-google" size={20} color="#4285F4" />
    <Button.Label className="font-semibold text-gray-700">
      Continue with Google
    </Button.Label>
  </View>
</Button>
```

### Secondary Button (Dark)

```tsx
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
  onPress={handlePress}
>
  <View className="flex-row items-center justify-center gap-3">
    <Ionicons name="logo-apple" size={20} color="#fff" />
    <Button.Label className="font-semibold text-white">
      Continue with Apple
    </Button.Label>
  </View>
</Button>
```

### Icon Container

```tsx
<View 
  className="w-14 h-14 rounded-2xl items-center justify-center"
  style={{ backgroundColor: accentColorSoft }}
>
  <Ionicons name="sparkles" size={28} color={accentColor} />
</View>
```

### Logo Header

```tsx
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
      source={require("path/to/app-icon.png")} 
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
```

---

## Decorative Elements

### Section Divider

```tsx
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
```

---

## Images

### Hero Image with Frame

```tsx
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
    source={require("path/to/image.jpg")}
    className="w-full h-full"
    resizeMode="cover"
  />
  {/* Soft gradient overlay for depth */}
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
```

---

## Bottom Sheets

### Styled Bottom Sheet

```tsx
<BottomSheet isOpen={isOpen} onOpenChange={setIsOpen}>
  <BottomSheet.Portal>
    <BottomSheet.Overlay />
    <BottomSheet.Content>
      {/* Gradient background */}
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
      />
      
      <View className="px-7 pb-8 pt-2">
        {/* Decorative icon */}
        <View className="items-center mb-5">
          <View 
            className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: accentColorSoft }}
          >
            <Ionicons name="sparkles" size={28} color={accentColor} />
          </View>
        </View>
        
        <BottomSheet.Title className="text-2xl font-bold text-center text-gray-900 mb-2">
          Sheet Title
        </BottomSheet.Title>
        <BottomSheet.Description className="text-gray-500 text-center mb-8 text-[15px] leading-5">
          Description text goes here
        </BottomSheet.Description>
        
        {/* Content */}
      </View>
    </BottomSheet.Content>
  </BottomSheet.Portal>
</BottomSheet>
```

---

## Screen Layout Template

```tsx
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/src/contexts/app-theme-context";

export default function ScreenName() {
  const insets = useSafeAreaInsets();
  const { colorTheme } = useAppTheme();
  
  // Theme colors
  const accentColor = colorTheme === "purple" ? "#8c2bee" : "#2ced6c";
  const accentColorLight = colorTheme === "purple" ? "#c084fc" : "#86efac";
  const accentColorSoft = colorTheme === "purple" 
    ? "rgba(140, 43, 238, 0.08)" 
    : "rgba(44, 237, 108, 0.08)";
  
  const gradientColors = colorTheme === "purple" 
    ? ['#FDF8FF', '#FBF4FF', '#F8EFFC', '#FDF8FF'] as const
    : ['#F8FFFA', '#F4FFF7', '#EFFCF3', '#F8FFFA'] as const;

  return (
    <View className="flex-1">
      {/* Background gradient */}
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
          {/* Screen content */}
        </View>
      </View>
    </View>
  );
}
```

---

## Accessibility Guidelines

- Maintain minimum touch target size of 44x44 points
- Ensure text contrast ratios meet WCAG AA standards
- Use semantic text hierarchy
- Provide visual feedback for all interactive elements
- Support dynamic type scaling where possible

---

## Icon Usage

Use **Ionicons** from `@expo/vector-icons` for consistency:

```tsx
import { Ionicons } from "@expo/vector-icons";

// Navigation icons
<Ionicons name="chevron-back" size={24} color={accentColor} />

// Action icons
<Ionicons name="sparkles" size={28} color={accentColor} />

// Social/Brand icons
<Ionicons name="logo-google" size={20} color="#4285F4" />
<Ionicons name="logo-apple" size={20} color="#000" />
```

---

## Required Dependencies

```json
{
  "expo-linear-gradient": "^14.x",
  "@expo/vector-icons": "^14.x",
  "react-native-safe-area-context": "^4.x",
  "heroui-native": "latest"
}
```

---

## File Structure

```
src/
├── contexts/
│   └── app-theme-context.tsx    # Theme provider with colorTheme
├── screens/
│   └── [ScreenName]/
│       └── index.tsx            # Screen component
├── components/
│   └── [ComponentName].tsx      # Reusable components
└── assets/
    └── images/
        └── [image-name].png     # Image assets
```

---

*Last updated: January 2026*

