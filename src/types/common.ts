export type GraphQLError = {
  extensions: {
    code: string
    exception: {
      code: string
    }
  }
  message: string
}

export type GraphQLErrorResponse = {
  response: {
    errors: GraphQLError[]
  }
}

export type APIErrorResponse = {
  response: {
    code: number
    message: string
    status: number
  }
}

export type SelectOptionType<T = string> = {
  label: string
  value: T
}

export enum ErrorCode {
  Forbidden = "FORBIDDEN",
}
