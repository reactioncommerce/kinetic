import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export * from "msw";
export const server = setupServer(...handlers);
