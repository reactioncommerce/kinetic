import { Template as APITemplate } from "@graphql/types";

export type EmailTemplate = {
  _id: APITemplate["_id"],
  title?: APITemplate["title"],
  subject?: APITemplate["subject"],
  template?: APITemplate["template"],
  language?: APITemplate["language"]
  name?: APITemplate["name"],
}
