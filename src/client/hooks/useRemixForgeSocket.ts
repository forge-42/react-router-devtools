import { Options, ReadyState,  } from "react-use-websocket";
import { useSettingsContext, useTerminalContext } from "../context/useRDTContext.js";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
 
const RETRY_COUNT = 2;

export const useRemixForgeSocket = (options?: Options) => {
  const { settings, setSettings } = useSettingsContext();
  const { terminals, toggleTerminalLock, setProcessId } = useTerminalContext();
  const { shouldConnectWithForge, port } = settings;
  const [retryCount, setRetryCount] = useState(0);
  const opts: Options = {
    ...options,
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: RETRY_COUNT,
    reconnectInterval: 0,
    onClose: (e) => {
      // connection closed by remix forge
      if (e.code === 1005) {
        setSettings({ shouldConnectWithForge: false });
        setRetryCount(0);
        terminals.forEach((terminal) => {
          toggleTerminalLock(terminal.id, false);
          setProcessId(terminal.id, undefined);
        });
        return;
      }
      if (retryCount < RETRY_COUNT) {
        return setRetryCount(retryCount + 1);
      }
      setSettings({ shouldConnectWithForge: false });
    },
  };

  const properties = useWebSocket(`ws://localhost:${port}`, opts, shouldConnectWithForge);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[properties.readyState];
  const isConnected = properties.readyState === ReadyState.OPEN;
  const isConnecting = properties.readyState === ReadyState.CONNECTING;

  return { ...properties, connectionStatus, isConnected, isConnecting };
};

interface RemixForgeMessage extends Record<string, unknown> {
  subtype: "read_file" | "open_file" | "delete_file" | "write_file";
  path: string;
  data?: string;
}

export const useRemixForgeSocketExternal = (options?: Options) => {
  const { sendJsonMessage, ...rest } = useRemixForgeSocket(options);
  const sendJsonMessageExternal = (message: RemixForgeMessage) => {
    sendJsonMessage({ ...message, type: "plugin" });
  };
  return { sendJsonMessage: sendJsonMessageExternal, ...rest };
};
