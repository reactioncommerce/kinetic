import { handlers as shippingMethodsHandlers } from "./shippingHandlers";
import { handlers as accountHandlers } from "./accountHandlers";
import { handlers as userHandlers } from "./userAndPermissionHandlers";

export const handlers = [...shippingMethodsHandlers, ...accountHandlers, ...userHandlers];
