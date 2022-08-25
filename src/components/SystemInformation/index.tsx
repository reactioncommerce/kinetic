import Dialog from "@mui/material/Dialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import DialogTitle from "@mui/material/DialogTitle";
import { FullPageLoader } from "@components/Loader/FullPageLoader";

import { SidebarItem } from "@components/Sidebar";
import { useShop } from "@containers/ShopProvider";
import { useSystemInformationQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";

export const SystemInformation = () => {
  const [open, setOpen] = useState(false);
  const { shopId } = useShop();

  const { data, isLoading } = useSystemInformationQuery(client, { shopId: shopId || "" }, { enabled: open && !!shopId });

  if (isLoading) return <FullPageLoader/>;

  return (
    <>
      <SidebarItem
        key="system-information"
        icon={<InfoOutlinedIcon fontSize="small" />}
        onClick={() => setOpen(true)}
        text="System Information"
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" PaperProps={{ sx: { width: "100%" } }}>
        <DialogTitle variant="h6" sx={{ bgcolor: "background.default" }}>
          System Information
        </DialogTitle>
        <DialogContent sx={{ padding: "0" }}>
          <Paper sx={{ width: "100%" }}>
            <TableContainer sx={{ overflowX: "unset" }}>
              <Table stickyHeader size="small" aria-label="system information table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: "10px", pl: "25px" }}>
                      Name
                    </TableCell>
                    <TableCell align="right">
                      Version
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key="apiVersion">
                    <TableCell sx={{ pl: "25px" }} component="th" scope="row">
                      Open Commerce API
                    </TableCell>
                    <TableCell align="right">{data?.systemInformation.apiVersion}</TableCell>
                  </TableRow>
                  <TableRow key="mongoDB">
                    <TableCell sx={{ pl: "25px" }} component="th" scope="row">
                      MongoDB
                    </TableCell>
                    <TableCell align="right">{data?.systemInformation.mongoVersion.version}</TableCell>
                  </TableRow>
                  {data?.systemInformation.plugins?.map((plugin) => (
                    <TableRow key={plugin?.name}>
                      <TableCell sx={{ pl: "25px" }} component="th" scope="row">
                        {plugin?.name}
                      </TableCell>
                      <TableCell align="right">{plugin?.version}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};
