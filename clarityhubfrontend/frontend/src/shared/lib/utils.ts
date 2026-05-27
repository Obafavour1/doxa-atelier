export const cn = (...parts: Array<string | false | null | undefined>) =>
	parts.filter(Boolean).join(" ");

export const formatCurrency = (amount: number) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);

export const sentenceCase = (value: string) =>
	value
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());

// Re-export common types for backward compatibility
export type { IProduct } from "../types/common.types";
