import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";


import { Table, TableAction, TableContainer, useTableState } from "@components/Table";
import { EmailTemplate } from "types/email";
import { useGetEmailTemplatesQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { filterNodes } from "@utils/common";

const EmailTemplates = () => {
  const { shopId } = useShop();
  const { pagination, handlePaginationChange } = useTableState();

  const { data, isLoading } = useGetEmailTemplatesQuery(
    client,
    { shopId: shopId!, first: pagination.pageSize, offset: pagination.pageIndex * pagination.pageSize }
  );

  const columns = useMemo((): ColumnDef<EmailTemplate>[] => [
    {
      accessorKey: "title",
      header: "Title"
    },
    {
      accessorKey: "subject",
      header: "Subject"
    },
    {
      accessorKey: "language",
      header: "Language",
      meta: {
        align: "right"
      }
    }
  ], []);

  return (
    <TableContainer>
      <TableContainer.Header
        title="Email Templates"
        action={<TableAction>Add</TableAction>}
      />
      <Table
        columns={columns}
        data={filterNodes(data?.emailTemplates?.nodes)}
        loading={isLoading}
        tableState={{ pagination }}
        onPaginationChange={handlePaginationChange}
        totalCount={data?.emailTemplates?.totalCount}
        maxHeight={600}
      />
    </TableContainer>
  );
};

export default EmailTemplates;
