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
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebSocketGlobal from "../modules/common/WebSocketGlobal";

export const queryClient = new QueryClient({});

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

  useEffect(() => {
    if (["/", "/login"].includes(pathname) && Boolean(employeeLogged)) {
      navigation.navigate("(menu)", { screen: "menu" });
    }

    if (
      !["/", "/login", "/settings"].includes(pathname) &&
      !Boolean(employeeLogged)
    ) {
      navigation.dispatch({ type: "POP_TO_TOP" });
    }
  }, [pathname]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" backgroundColor={Colors.primary} />
          <View style={{ flex: 1, backgroundColor: Colors.graySoft }}>
            <WebSocketGlobal>
              <Slot />
            </WebSocketGlobal>
          </View>

          <FlashMessage position="top" />
        </QueryClientProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
