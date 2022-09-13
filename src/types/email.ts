import { Template as APITemplate, StorefrontUrls, EmailJob } from "@graphql/types";

export type EmailTemplate = {
  _id: APITemplate["_id"],
  title?: APITemplate["title"],
  subject?: APITemplate["subject"],
  template?: APITemplate["template"],
  language?: APITemplate["language"]
  name?: APITemplate["name"],
}

export type EmailVariables = Omit<StorefrontUrls, "__typename">
export type EmailLog = Omit<EmailJob, "__typename">
