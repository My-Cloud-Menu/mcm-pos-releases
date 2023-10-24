import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Slot, SplashScreen, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { View, useColorScheme } from "react-native";
import "../modules/common/theme/MCMTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FlashMessage from "react-native-flash-message";
import { Colors } from "react-native-ui-lib";
import useAuthStore from "../modules/auth/AuthStore";

export const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const employeeLogged = useAuthStore((state) => state.employeeLogged);
  const pathname = usePathname();
  const navigation = useNavigation();
  console.log(employeeLogged);

  useEffect(() => {
    if (["/", "/login"].includes(pathname) && Boolean(employeeLogged)) {
      navigation.navigate("(menu)", { screen: "menu" });
    }

    if (!["/", "/login"].includes(pathname) && !Boolean(employeeLogged)) {
      console.log("dale pa atras");
      navigation.dispatch({ type: "POP_TO_TOP" });
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: Colors.graySoft }}>
        <Slot />
      </View>
      {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(menu)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider> */}
      <FlashMessage position="top" />
    </QueryClientProvider>
  );
}
