export type Error = {
  extensions: {
    code: string;
    exception: {
      code: string;
    };
  };
  message: string;
};

export type APIErrorResponse = {
  response: {
    errors: Error[];
  };
};
