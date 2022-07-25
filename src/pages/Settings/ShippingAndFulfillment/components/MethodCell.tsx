export const MethodCell = ({ data = [] }: {data?: string[]}) => (
  <>
    {data.length === 1
      ? "1 Method"
      : `${data.length} Methods`}
  </>
);
