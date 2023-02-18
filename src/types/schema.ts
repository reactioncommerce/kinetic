
export enum Type {
  String = "string",
  Object = "object",
  Array = "array",
  Number = "number",
  Boolean = "boolean",
  Integer = "integer",
  DateTime = "date-time",
}

export type FieldProperty<FieldType extends Type = Type> = {
  type: FieldType
  path: string
  format?: string
  items: FieldProperty<FieldType>["type"] extends Type.Array ? Array<FieldProperty<Type>> : undefined
  properties: FieldProperty<FieldType>["type"] extends Type.Object ? {[key: string]: FieldProperty<FieldType>} : undefined
  required: string[]
  enum?: string[]
  minimum: FieldProperty<FieldType>["type"] extends (Type.Integer | Type.Number) ? number : undefined
}

export type SchemaProperties<FieldType extends Type = Type> = {
  [key: string]: FieldProperty<FieldType>
}
