import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

type BreadcrumbContextType = [breadcrumbs: Record<string, string>, setBreadcrumbs: Dispatch<SetStateAction<Record<string, string>>>];

export const useGlobalBreadcrumbs = () => useOutletContext<BreadcrumbContextType>();
