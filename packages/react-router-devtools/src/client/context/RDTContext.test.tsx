import { render } from "@testing-library/react"
import { REACT_ROUTER_DEV_TOOLS_SETTINGS, REACT_ROUTER_DEV_TOOLS_STATE } from "../utils/storage.js"
import { RDTContextProvider, getSettings } from "./RDTContext.js"

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
