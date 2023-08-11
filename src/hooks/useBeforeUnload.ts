import { useEffect } from "react";
import { unstable_useBlocker as useBLocker } from "react-router-dom";
import { useBeforeUnload as useBeforeUnloadHook } from "react-use";

export const useBeforeUnload = (enabled: boolean) => {
  const blocker = useBLocker(enabled);

  useBeforeUnloadHook(enabled, "some message");
  useEffect(() => {
    if (blocker.state === "blocked" && !enabled) {
      blocker.reset();
    }
  }, [blocker, enabled]);
  return blocker;
};
