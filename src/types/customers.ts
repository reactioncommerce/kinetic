import { Account } from "@graphql/types";


export type Customer = Pick<Account, "_id"| "name" | "primaryEmailAddress" | "createdAt" | "userId">
