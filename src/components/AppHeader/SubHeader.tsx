import Stack from "@mui/material/Stack";
import { Link, RouteObject, useMatch, useResolvedPath } from "react-router-dom";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

export type SubHeaderItemProps = RouteObject & {
  header: string
  path: string
  key: string
}

type SubHeaderProps = {
  items: SubHeaderItemProps[]
}


const activeStyles: SxProps = {
  "backgroundColor": "success.light",
  "&:hover": {
    backgroundColor: "success.light"
  }
};


const SubHeaderItem = ({ path, header }: SubHeaderItemProps) => {
  const resolvedPath = useResolvedPath(path);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return <Button size="small" color={match ? "success" : "secondary"} component={Link}
    to={path} sx={match ? activeStyles : {}}>
    {header}
  </Button>;
};

export const SubHeader = ({ items }: SubHeaderProps) => (
  <Paper variant="outlined" square>
    <Stack direction="row" spacing={1} justifyContent="center"
      alignItems="center" padding={1}>
      {items.map(({ key, ...item }) => <SubHeaderItem key={key} {...item} />)}
    </Stack>
  </Paper>

);
