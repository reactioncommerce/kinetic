import Stack from "@mui/material/Stack";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export type SubHeaderItemProps = {
  label: string
  href: string
  key: string
}

type SubHeaderProps = {
  items: SubHeaderItemProps[]
}


const activeStyles: SxProps = {
  "backgroundColor": "background.lightGreen",
  "color": "primary.main",
  "&:hover": {
    backgroundColor: "background.lightGreen"
  }
};


const SubHeaderItem = ({ href, label }: SubHeaderItemProps) => {
  const resolvedPath = useResolvedPath(href);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  return <Button size="small" color="secondary" component={Link}
    to={href} sx={match ? activeStyles : {}}>
    <Typography variant="subtitle2">{label}</Typography>
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
