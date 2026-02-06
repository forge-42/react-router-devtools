import { useEffect, useState } from "react"
import { COMMAND_K_SEARCH_HISTORY, getStorageItem, removeStorageItem, setStorageItem } from "~/utils/local-storage"
import { normalizeVersion } from "~/utils/version-resolvers"
import type { HistoryItem } from "../search-types"

const MAX_HISTORY_ITEMS = 10

function keyFor(version: string) {
	const { version: v } = normalizeVersion(version)
	return `${COMMAND_K_SEARCH_HISTORY}-${v}`
}

export const useSearchHistory = (version: string) => {
	const storageKey = keyFor(version)
	const [history, setHistory] = useState<HistoryItem[]>([])

	useEffect(() => {
		try {
			const stored = getStorageItem(storageKey)
			if (!stored) {
				setHistory([])
				return
			}
			const parsed = JSON.parse(stored)
			setHistory(Array.isArray(parsed) ? parsed : [])
		} catch (err) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to load search history:", err)
			setHistory([])
		}
	}, [storageKey])

	useEffect(() => {
		try {
			setStorageItem(storageKey, JSON.stringify(history))
		} catch (err) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to save search history:", err)
		}
	}, [history, storageKey])

	const addToHistory = (item: HistoryItem) => {
		setHistory((prev) => {
			const idx = prev.findIndex((h) => h.id === item.id)
			if (idx >= 0) {
				const existing = prev[idx]
				const updated = {
					...existing,
					type: item.type ?? existing.type,
					title: item.title ?? existing.title,
					subtitle: item.subtitle ?? existing.subtitle,
					paragraphs: item.paragraphs ?? existing.paragraphs,
					highlightedText: item.highlightedText ?? existing.highlightedText,
				}
				return [updated, ...prev.slice(0, idx), ...prev.slice(idx + 1)].slice(0, MAX_HISTORY_ITEMS)
			}
			return [item, ...prev].slice(0, MAX_HISTORY_ITEMS)
		})
	}

	const clearHistory = () => {
		setHistory([])
		removeStorageItem(storageKey)
	}

	const removeFromHistory = (itemId: string) => {
		setHistory((prev) => prev.filter((item) => item.id !== itemId))
	}

	return { history, addToHistory, clearHistory, removeFromHistory }
}
