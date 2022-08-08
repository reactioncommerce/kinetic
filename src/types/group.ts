import { Group as APIGroup } from "@graphql/types";

export type Group = {
  _id?: APIGroup["_id"],
  name: APIGroup["name"],
  description?: APIGroup["description"],
  permissions?: APIGroup["permissions"],
}
