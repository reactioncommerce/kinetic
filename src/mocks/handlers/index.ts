import { handlers as shippingMethodsHandlers } from "./shippingHandlers";
import { handlers as accountHandlers } from "./accountHandlers";

export const handlers = [...shippingMethodsHandlers, ...accountHandlers];
