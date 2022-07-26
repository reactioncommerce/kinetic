type MethodCellProps = {
  data?: string[]
}

export const MethodCell = ({ data = [] }: MethodCellProps) => (
  <>
    {data.length === 1
      ? "1 Method"
      : `${data.length} Methods`}
  </>
);
