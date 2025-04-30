import { render } from "@testing-library/react"
import * as detachedMethods from "../utils/detached.js"
import {
	REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED,
	REACT_ROUTER_DEV_TOOLS_DETACHED,
	REACT_ROUTER_DEV_TOOLS_SETTINGS,
	REACT_ROUTER_DEV_TOOLS_STATE,
} from "../utils/storage.js"
import {
	RDTContextProvider,
	//detachedModeSetup,
	getSettings,
	resetIsDetachedCheck,
	setIsDetachedIfRequired,
	//getExistingStateFromStorage,
} from "./RDTContext.js"

vi.mock("react-router", () => ({
	useLocation: () => ({
		pathname: "/",
	}),
	useNavigate: () => vi.fn(),
	useNavigation: () => vi.fn(),
}))

describe("RDTContextProvider", () => {
	it("renders without crashing when localstorage and session storage have no values", () => {
		vi.spyOn(sessionStorage, "getItem").mockReturnValue(null)
		vi.spyOn(localStorage, "getItem").mockReturnValue(null)
		const { container } = render(
			<RDTContextProvider>
				<div>Test</div>
			</RDTContextProvider>
		)
		expect(container).toBeTruthy()

		expect(localStorage.getItem).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_STATE)
		expect(localStorage.getItem).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_SETTINGS)
	})

	it("renders with existing values retrieved from local and session storage", () => {
		vi.spyOn(sessionStorage, "getItem").mockReturnValue(
			JSON.stringify({
				timeline: [],
			})
		)
		vi.spyOn(localStorage, "getItem").mockReturnValue(
			JSON.stringify({
				position: "top-right",
			})
		)
		const { container } = render(
			<RDTContextProvider>
				<div>Test</div>
			</RDTContextProvider>
		)
		expect(container).toBeTruthy()
		expect(localStorage.getItem).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_STATE)
		expect(localStorage.getItem).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_SETTINGS)
	})
})

describe("getSettings", () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it("should return no settings when storage is empty", () => {
		vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null)

		const settings = getSettings()

		expect(settings).toEqual({})
	})

	it("should return merged settings when storage has values", () => {
		const storedSettings = {
			theme: "dark",
			fontSize: 16,
		}
		vi.spyOn(localStorage, "getItem").mockReturnValueOnce(JSON.stringify(storedSettings))

		const settings = getSettings()

		expect(settings).toEqual(storedSettings)
	})
})

describe("setIsDetachedIfRequired", () => {
	it('should set REACT_ROUTER_DEV_TOOLS_DETACHED to "true" if window is not detached but RDT_MOUNTED is true', () => {
		const isDetachedWindowSpy = vi.spyOn(detachedMethods, "checkIsDetachedWindow").mockReturnValue(false)
		const setSessionSpy = vi.spyOn(sessionStorage, "setItem")
		const window = { RDT_MOUNTED: true }
		;(global as any).window = window
		setIsDetachedIfRequired()
		expect(isDetachedWindowSpy).toHaveBeenCalled()
		expect(setSessionSpy).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_DETACHED, "true")
	})

	it("should not set REACT_ROUTER_DEV_TOOLS_DETACHED if window is detached", () => {
		const isDetachedWindowSpy = vi.spyOn(detachedMethods, "checkIsDetachedWindow").mockReturnValue(true)
		const setSessionSpy = vi.spyOn(sessionStorage, "setItem")
		const window = { RDT_MOUNTED: false }
		;(global as any).window = window

		setIsDetachedIfRequired()
		expect(isDetachedWindowSpy).toHaveBeenCalled()
		expect(setSessionSpy).not.toHaveBeenCalled()
	})

	it("should not set REACT_ROUTER_DEV_TOOLS_DETACHED if RDT_MOUNTED is false && isDetachedWindow is false", () => {
		const isDetachedWindowSpy = vi.spyOn(detachedMethods, "checkIsDetachedWindow").mockReturnValue(false)
		const setSessionSpy = vi.spyOn(sessionStorage, "setItem")
		const window = { RDT_MOUNTED: false }
		;(global as any).window = window

		setIsDetachedIfRequired()
		expect(isDetachedWindowSpy).toHaveBeenCalled()
		expect(setSessionSpy).not.toHaveBeenCalled()
	})
})

describe("resetIsDetachedCheck", () => {
	it('should set REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED to "false" whenever the window is mounted', () => {
		const setStorageSpy = vi.spyOn(localStorage, "setItem")

		resetIsDetachedCheck()
		expect(setStorageSpy).toHaveBeenCalledWith(REACT_ROUTER_DEV_TOOLS_CHECK_DETACHED, "false")
	})
})
