export interface SearchRecord {
	id: string //e.g "/configuration/editor#name" where name is the heading inside of the editor page under the configuration section
	title: string // page title
	subtitle: string // title of the "sections" inside the page
	paragraphs: string[] // for that id (section of the current page) get all paragraphs as an array of strings
}

export interface SearchResult {
	item: SearchRecord
	score: number
	matchedText: string
	highlightedText: string
	refIndex: number // 0 if heading, >0 if actual paragraph
}

export interface FuzzySearchOptions {
	threshold: number
	minMatchCharLength: number
}

export type MatchType = "heading" | "paragraph"

export interface HistoryItem extends SearchRecord {
	type?: MatchType
	highlightedText?: string
}
