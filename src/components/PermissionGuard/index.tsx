import { useAccount } from "@containers/AccountProvider";
import { AccessDenied } from "@components/ErrorBoundary";

type PermissionGuardProps = {
  children: JSX.Element
  permissions: string[]
  fallback?: JSX.Element
}

export const PermissionGuard = ({ children, permissions, fallback = <AccessDenied/> }: PermissionGuardProps) => {
  const { availableRoles } = useAccount();
  const allowed = permissions.every((permission) => availableRoles[permission]);

  return (
    allowed ? children : fallback
  );
};

export const usePermission = (permissions: string[]): boolean => {
  const { availableRoles } = useAccount();
  return permissions.every((permission) => availableRoles[permission]);
};
