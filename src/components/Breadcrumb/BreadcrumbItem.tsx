import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { RouterLink } from "./LinkRouter";

type BreadcrumbItemProps = {
  last: boolean
  label: string
  to: BreadcrumbItemProps["last"] extends true ? undefined : string
}

export const BreadcrumbItem = ({ last, label, to }: BreadcrumbItemProps) => (
  last ? (
    <Chip
      label={label}
      key={to}
    />
  ) : (
    <RouterLink underline="none" color="inherit" to={to} key={to}>
      <Typography variant="subtitle2">{label}</Typography>
    </RouterLink>
  )
);
