import { Account } from "@graphql/types";

import { Group } from "./group";

export type User = Pick<Account, "_id"| "name" | "primaryEmailAddress"> & {
  groups: Group[]
}
