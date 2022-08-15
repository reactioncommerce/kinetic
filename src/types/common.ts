declare module "react-router-dom" {
  interface RouteObject {
    title?: string;
  }
}

export type Error = {
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
    errors: Error[]
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
