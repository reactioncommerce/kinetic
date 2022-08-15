import { SubHeaderItemProps } from "@components/AppHeader";
import { PageLayout } from "@containers/Layouts";

const headers: SubHeaderItemProps[] = [
  {
    label: "Users",
    href: "",
    key: "users"
  },
  {
    label: "Groups",
    href: "groups",
    key: "groups"
  }
];

const UsersAndPermissions = () => (
  <PageLayout headers={headers}/>
);

export default UsersAndPermissions;
