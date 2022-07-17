import { handlers as shippingMethodsHandlers } from "./shippingMethodsHandlers";
import { handlers as accountHandlers } from "./accountHandlers";

export const handlers = [...shippingMethodsHandlers, ...accountHandlers];
