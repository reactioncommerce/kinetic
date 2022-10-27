import Link, { LinkProps } from "@mui/material/Link";
import {
  Link as RouterLink
} from "react-router-dom";

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

export const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink}/>
);
