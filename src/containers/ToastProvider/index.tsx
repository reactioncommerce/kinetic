import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { noop } from "lodash-es";
import { AlertColor } from "@mui/material";

import { Toast, ToastMessage } from "@components/Toast";

type ToastContextProps = {
  addMessage: (message: ToastMessage) => void
}

const ToastContext = createContext<ToastContextProps>({
  addMessage: noop
});

export const useToast = () => {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addMessage } = toastContext;
  const show = useCallback((message: string, options: { severity: AlertColor }) => {
    addMessage({ message, ...options, key: new Date().getTime() });
  }, [addMessage]);

  const toastHandlers = useMemo(() => ({
    show,
    info(message: string) {
      show(message, { severity: "info" });
    },
    success(message: string) {
      show(message, { severity: "success" });
    },
    warning(message: string) {
      show(message, { severity: "warning" });
    },
    error(message: string) {
      show(message, { severity: "error" });
    }
  }), [show]);

  return toastHandlers;
};

export const ToastProvider = ({ children }: {children: JSX.Element}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeMessage = (key: number) => setMessages((currentMessages) => currentMessages.filter((message) => message.key !== key));

  const addMessage = useCallback((message: ToastMessage) => setMessages((currentMessages) => currentMessages.concat(message)), []);

  return (
    <ToastContext.Provider value={{ addMessage }}>
      {children}
      {messages.map((message) => (
        <Toast
          key={message.key}
          message={message}
          onExited={() => removeMessage(message.key)}
        />
      ))}
    </ToastContext.Provider>
  );
};
