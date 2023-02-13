
export enum Type {
  String = "string",
  Object = "object",
  Array = "array",
  Number = "number",
  Boolean = "boolean",
  Integer = "integer"
}

export type FieldProperty = {
  type: Type
  path: string
  format?: string
  items: FieldProperty["type"] extends Type.Array ? Array<FieldProperty> : undefined
  properties: FieldProperty["type"] extends Type.Object ? {[key: string]: FieldProperty} : undefined
  required: string[]
}

export type SchemaProperties = {
  [key: string]: FieldProperty
}
