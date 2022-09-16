import { handlers as shippingMethodsHandlers } from "./shippingHandlers";
import { handlers as accountHandlers } from "./accountHandlers";
import { handlers as userHandlers } from "./userAndPermissionHandlers";
import { handlers as shopSettingsHandlers } from "./shopSettingsHandlers";
import { handlers as transactionalEmailHandlers } from "./transactionalEmailHandlers";
import { handlers as checkoutSettingsHandlers } from "./checkoutSettingsHandlers";

export const handlers = [
  ...shippingMethodsHandlers, ...accountHandlers, ...userHandlers, ...shopSettingsHandlers, ...transactionalEmailHandlers, ...checkoutSettingsHandlers
];
