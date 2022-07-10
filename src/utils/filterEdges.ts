export function filterEdges<T>(edges: (T | null | undefined)[] | null | undefined) {
  return edges?.filter((edge): edge is T => !!edge) ?? [];
}

export function filterNodes<T>(nodes?: (T | null)[] | undefined | null) {
  return nodes?.filter((node): node is T => !!node) ?? [];
}
