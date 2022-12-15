import Link, { LinkProps } from "@mui/material/Link";
import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps
} from "react-router-dom";

type LinkRouterProps = LinkProps & Pick<ReactRouterLinkProps, "to" | "replace">

export const RouterLink = (props: LinkRouterProps) => (
  <Link {...props} component={ReactRouterLink}/>
);
