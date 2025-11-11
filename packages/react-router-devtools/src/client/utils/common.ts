export const cutArrayToFirstN = <T>(arr: T[], n: number) => {
	if (arr.length < n) return arr
	return arr.slice(0, n)
}
