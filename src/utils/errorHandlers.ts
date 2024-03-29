import { APIErrorResponse, GraphQLErrorResponse } from "types/common";

export const formatErrorResponse = (error: unknown): {code?: string | number, status?: number, message?: string} => {
  const responseError = error as APIErrorResponse | GraphQLErrorResponse;
  if (responseError.response && "errors" in responseError.response) {
    const { errors } = responseError.response;
    const firstError = errors.length ? errors[0] : null;
    const errorCode = firstError?.extensions.exception.code || firstError?.extensions.code;
    return { code: errorCode, message: firstError?.message };
  }
  return responseError.response;
};

export const isNetworkError = (error: unknown): boolean => (error as Error).message === "Network request failed";
