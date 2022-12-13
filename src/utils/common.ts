import { SurchargePropertyType } from "@graphql/types";

export function filterNodes<T>(nodes?: (T | null)[] | undefined | null) {
  return nodes?.filter((node): node is T => !!node) ?? [];
}

export const getPropertyType = (value: string): SurchargePropertyType => {
  if (value.toLowerCase() === "false" || value.toLowerCase() === "true") return SurchargePropertyType.Bool;
  if (!Number.isNaN(value) && Number.isInteger(+value)) return SurchargePropertyType.Int;
  if (!Number.isNaN(value) && !Number.isInteger(+value)) return SurchargePropertyType.Float;
  return SurchargePropertyType.String;
};


export const formatDateTime = (date: Date, locale = "en-US") => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);

export const formatDate = (date: Date, locale = "en-US") => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
