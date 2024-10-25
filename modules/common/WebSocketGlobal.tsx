import { router } from "expo-router";
import { queryClient } from "../../app/_layout";
import { useCartStore } from "../../stores/cartStore";
import { getEcrStatus, makeEcrLogout } from "../auth/AuthApi";
import useEcrStore from "../ecr/EcrStore";
import {
  getECRDetailedReport,
  getEcrJournal,
  getJournal,
  makeEcrSettle,
} from "../payment/PaymentApi";
import { settingQueryKey } from "../settings/SettingsApi";
import useGlobalStore from "./GlobalStore";
import constants from "expo-constants";
import { useEffect, useState } from "react";
import useIsInternetConnected from "./hooks/useIsInternetConnected";
import { getECRSetup, getGlobalSetup } from "../../components/RequestInitialCode";

const handleWebSocketActions = async (event: MessageEvent, websocket: any, saveECRSetup: any, saveGlobalSetup: any) => {
  try {
    const onSuccess = (payload: Record<string, any>) => {
      websocket.send(
        JSON.stringify({
          result: "success",
          ...payload,
        })
      );
    };

    const onError = (payload: Record<string, any>) => {
      websocket.send(
        JSON.stringify({
          result: "error",
          ...payload,
        })
      );
    };

    let data;

    try {
      data = JSON.parse(event.data);
    } catch {
      onError({ details: "Invalid JSON data" });

      return;
    }
    const clearCart = useCartStore.getState().clearCart;

    switch (data.type) {
      case "getSetup":
        const globalSetup = useGlobalStore.getState().setup;
        const ecrStoreSetup = useEcrStore.getState().setup;

        onSuccess({
          setup: globalSetup,
          verifoneSetup: ecrStoreSetup,
        });

        break;

      case "saveSetup":
        const hasAValidPayload =
          data?.payload?.setup && data?.payload?.verifoneSetup;

        if (hasAValidPayload) {
          onSuccess({
            details: "Setup Saved Successfully",
          });

          const saveGlobalSetup = useGlobalStore.getState().saveSetup;
          const saveEcrSetup = useEcrStore.getState().saveSetup;

          saveGlobalSetup(data?.payload?.setup);
          saveEcrSetup(data?.payload?.verifoneSetup);

          queryClient.invalidateQueries({
            queryKey: ["front/menu"],
          });

          queryClient.invalidateQueries({
            queryKey: [settingQueryKey],
          });
        } else {
          websocket.send(
            JSON.stringify({
              result: "error",
              details: `Missing setup or verifoneSetup data`,
            })
          );
        }

        break;

      case "makeVerifoneTestConnection":
        let loginResult = await makeEcrLogout();

        await makeEcrLogout();

        onSuccess({
          details: "Terminal Connection Successful",
          loginDetails: loginResult,
        });

        break;

      case "makeSettle":
        await makeEcrLogout();
        let settleResult = await makeEcrSettle("HTML");
        makeEcrLogout().then().catch();

        onSuccess({
          settleDetails: settleResult,
        });

        break;

      case "getJournal":
        await makeEcrLogout();

        let targetReference = data?.payload?.target_reference || "all";

        let start = data?.payload?.start || undefined;

        let journalResult = await getJournal({
          target_reference: targetReference,
          start: start,
        });

        console.log({ journalResult })

        makeEcrLogout().then().catch();

        onSuccess({
          journalDetails: journalResult,
        });

        break;

      case "getVerifoneStatus":
        await makeEcrLogout();

        let ecrStatus = await getEcrStatus();

        makeEcrLogout().then().catch();

        onSuccess({
          verifoneStatus: ecrStatus,
        });

        break;

      case "getDetailedReport":
        await makeEcrLogout();
        let detailedReportResult = await getECRDetailedReport();

        makeEcrLogout().then().catch();

        onSuccess({
          detailedReport: detailedReportResult,
        });

        break;

      case "invalidateMenuData":
        queryClient.invalidateQueries({ queryKey: ["front/menu"] });

        onSuccess({ details: "Menu data invalidated" });

        break;

      case "invalidateAllData":
        console.log("invalidated");
        queryClient.invalidateQueries();

        onSuccess({ details: "All data invalidated" });
        break;

      case "invalidateDataHard":
        queryClient.clear();
        queryClient.invalidateQueries();

        clearCart();
        router.push("/(menu)/menu");

        onSuccess({ details: "All data invalidated" });

        break;

      case "navigateToSpecificScreen":
        let screen = data?.payload?.screen;

        if (screen) {
          router.push(screen);
          onSuccess({ details: "Navigated to specific screen successfully" });
        } else {
          onError({ details: "Missing screen data" });
        }

        break;

      case "clearCart":
        clearCart();
        router.push("/(menu)/menu");

        onSuccess({ details: "Cart cleared successfully" });
        break;

      case "sync":
        console.log("here")
        const newSetup = data?.payload?.newSetup;
        console.log({ newSetup })
        const parsedECRSetup = getECRSetup(newSetup);
        const parsedGlobalRSetup = getGlobalSetup(newSetup);
        // console.log("over:", newSetup.setup)
        // console.log({ parsedECRSetup });
        saveECRSetup(parsedECRSetup);
        saveGlobalSetup(parsedGlobalRSetup);
        onSuccess({ details: "Sync successfully" });
        break;

      case "getKioskVersion":
        onSuccess({
          details: constants.expoConfig?.version,
        });

        break;

      default:
        websocket.send(
          JSON.stringify({
            result: "error",
            details: `Action not implemented`,
          })
        );
        break;
    }
  } catch (error: any) {
    websocket.send(
      JSON.stringify({
        result: "error",
        details: `Unhandled Error`,
        error: error,
      })
    );
  }
};

const WebSocketGlobal = () => {
  const [ws, setWs] = useState<any>(null);
  const setup = useGlobalStore((state) => state.setup);
  const { saveSetup: saveECRSetup } = useEcrStore();
  const { saveSetup: saveGlobalSetup } = useGlobalStore();
  const { isConnected } = useIsInternetConnected();

  const getWebSocketUrl = () => {
    let webSocketUrl = "";
    const urlIsHttps = setup.url.startsWith("https://");

    if (urlIsHttps) {
      webSocketUrl = setup.url.replace("https://", "wss://");
    } else {
      webSocketUrl = setup.url.replace("http://", "ws://");
    }

    webSocketUrl += "/kiosks";

    return webSocketUrl;
  };

  const connect = () => {
    try {
      console.log('breakpoint #2')
      // closeWebSocket();

      const websocket = new WebSocket(getWebSocketUrl(), setup.apiKey);
      console.log("Inntentando conectar", setup.apiKey, setup.url, setup.id);
      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({
            type: "register",
            clientId: setup.id,
          })
        );
      };

      websocket.onmessage = (event) => {
        handleWebSocketActions(event, websocket, saveECRSetup, saveGlobalSetup).then().catch();
      };

      websocket.onclose = () => { };

      setWs(websocket);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    connect();

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      // console.log("breakpoint #3")
      closeWebSocket();
    };
  }, [setup.siteId, setup.id]);

  const closeWebSocket = () => {
    console.warn("Closing WebSocket connection");
    try {
      if (ws) {
        ws.close();
      }
    } catch { }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        let isWebSocketOpen = ws && ws?.readyState === WebSocket.OPEN;

        if (isConnected && !isWebSocketOpen) {
          connect();
        } else if (!isConnected) {
          if (isWebSocketOpen) {
            console.log("breakpoint #1")
            closeWebSocket();
          }
        } else {
          // Everything working good, internet is online and WebSocket is open
        }
      } catch (err) {
        connect(); // Reconnect if there is an error
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [ws, isConnected]);

  return <></>;
};

export default WebSocketGlobal;
