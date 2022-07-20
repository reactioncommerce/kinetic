export function filterNodes<T>(nodes?: (T | null)[] | undefined | null) {
  return nodes?.filter((node): node is T => !!node) ?? [];
}
