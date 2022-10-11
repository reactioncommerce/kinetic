import { useAccount } from "@containers/AccountProvider";
import { AccessDenied } from "@components/ErrorBoundary";

type PermissionGuardProps = {
  children: JSX.Element
  permissions: string[]
  fallback?: JSX.Element
}

const ROLE_PREFIX = "reaction:legacy";

export const PermissionGuard = ({ children, permissions, fallback = <AccessDenied/> }: PermissionGuardProps) => {
  const { availableRoles } = useAccount();
  const allowed = availableRoles.length && permissions.every((permission) => availableRoles.includes(`${ROLE_PREFIX}:${permission}`));

  return (
    allowed ? children : fallback
  );
};

export const usePermission = (permissions: string[]): boolean => {
  const { availableRoles } = useAccount();
  return !!availableRoles.length && permissions.every((permission) => availableRoles.includes(`${ROLE_PREFIX}:${permission}`));
};
