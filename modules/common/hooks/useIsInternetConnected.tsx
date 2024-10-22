import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import useGlobalStore from "../GlobalStore";

const useIsInternetConnected = () => {
  const [isConnected, setIsConnected] = useState(true);

  let noConnectionMessage = useGlobalStore(
    (state) => state.setup?.noConnectionMessage
  );

  if (!noConnectionMessage)
    noConnectionMessage = "No connection. Please go to the counter. Thank you";

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, noConnectionMessage };
};

export default useIsInternetConnected;
