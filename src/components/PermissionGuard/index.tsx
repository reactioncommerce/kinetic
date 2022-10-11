import React from "react";

import { useAccount } from "@containers/AccountProvider";
import { AccessDenied } from "@components/ErrorBoundary";

type PermissionGuardProps = {
  children: JSX.Element
  permissions: string[]
}

const ROLE_PREFIX = "reaction:legacy";

export const PermissionGuard = ({ children, permissions }: PermissionGuardProps) => {
  const { availableRoles } = useAccount();
  const allowed = availableRoles.length && permissions.every((permission) => availableRoles.includes(`${ROLE_PREFIX}:${permission}`));

  return (
    allowed ? children : <AccessDenied/>
  );
};

export const usePermission = (permissions: string[]): boolean => {
  const { availableRoles } = useAccount();
  return !!availableRoles.length && permissions.every((permission) => availableRoles.includes(`${ROLE_PREFIX}:${permission}`));
};
