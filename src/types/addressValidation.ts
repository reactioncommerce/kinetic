import { AddressValidationRule as APIAddressValidationRule } from "@graphql/types";

export type AddressValidationRule = Pick<APIAddressValidationRule, "_id" | "countryCodes" | "serviceName">
