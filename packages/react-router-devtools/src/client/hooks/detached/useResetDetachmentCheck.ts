import { useDetachedWindowControls } from "../../context/useRDTContext.js"
import { REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED, setStorageItem } from "../../utils/storage.js"
import { useAttachListener } from "../useAttachListener.js"
import { useCheckIfStillDetached } from "./useCheckIfStillDetached.js"

export const useResetDetachmentCheck = () => {
	const { isDetached } = useDetachedWindowControls()
	useCheckIfStillDetached()
	useAttachListener("unload", "window", () => setStorageItem(REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED, "true"), isDetached)
}
