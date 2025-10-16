export const cutArrayToLastN = <T>(arr: T[], n: number) => {
	if (arr.length < n) return arr
	return arr.slice(arr.length - n)
}

export const cutArrayToFirstN = <T>(arr: T[], n: number) => {
	if (arr.length < n) return arr
	return arr.slice(0, n)
}
