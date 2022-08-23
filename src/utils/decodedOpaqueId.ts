import { Buffer } from "buffer";

export function decodeOpaqueId(opaqueId?: string | null) {
  if (opaqueId === undefined || opaqueId === null) return null;
  const [namespace, id] = Buffer
    .from(opaqueId, "base64")
    .toString("utf8")
    .split(":", 2);

  if (namespace && namespace.startsWith("reaction/") && id) {
    return { namespace, id };
  }

  return { namespace: null, id: opaqueId };
}
