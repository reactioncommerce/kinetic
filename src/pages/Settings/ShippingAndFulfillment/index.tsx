import { useMemo } from "react";

import { PageLayout } from "@containers/Layouts";
import { useRoute } from "@containers/RoutesProvider";
import { SubHeaderItemProps } from "@components/AppHeader";

export default function ShippingAndFulfillment() {
  const route = useRoute("shipping-fulfillment");

  const headers = useMemo<SubHeaderItemProps[]>(() => route?.children?.map((child) => ({
    label: child.title || "",
    path: child.path || "",
    key: child.path || ""
  })) || [], [route]);

  return <PageLayout headers={headers}/>;
}

