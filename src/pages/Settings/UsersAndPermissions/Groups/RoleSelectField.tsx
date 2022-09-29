import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { startCase } from "lodash-es";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useState } from "react";
import { FieldProps } from "formik";

import { useShop } from "@containers/ShopProvider";
import { useGetRolesQuery } from "@graphql/generates";
import { client } from "@graphql/graphql-request-client";
import { InputWithLabel } from "@components/TextField";
import { filterNodes } from "@utils/common";

const NUMBER_OF_ROLES = 200;

export type RoleItem = {
  name: string
  label: string
}

export const normalizeRoles = (roleNames: string[]) => {
  const groupedRoleByResource = roleNames.reduce((roleByResource, roleName) => {
    const [resource, action] = roleName.split("/");
    (roleByResource[resource] || (roleByResource[resource] = [])).push({ name: roleName, label: startCase(action) });
    return roleByResource;
  }, {} as Record<string, RoleItem[]>);

  return groupedRoleByResource;
};

const getResourceLabel = (name: string) => startCase(name.split(":")[2] || "Unknown");

type RoleSelectFieldProps = FieldProps<Record<string, RoleItem[]>>

export const RoleSelectField = ({ field: { value: selectedRoles, name: fieldName }, form: { setFieldValue } }: RoleSelectFieldProps) => {
  const { shopId } = useShop();

  const [allRolesByResource, setRolesByResource] =
  useState<Record<string, RoleItem[]>>();

  const { data } = useGetRolesQuery(client, { shopId: shopId!, first: NUMBER_OF_ROLES }, {
    select: (response) => {
      const roleNames = filterNodes(response.roles?.nodes).map(({ name }) => name);
      const allRoles = normalizeRoles(roleNames);
      return { roleNames, allRoles };
    },
    onSuccess: (response) => {
      if (!allRolesByResource) { setRolesByResource(response.allRoles); }
    }
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const search = event.target.value;
    const filteredRoles = (data?.roleNames || []).filter((roleName) => roleName.includes(search.toLowerCase()));
    setRolesByResource(normalizeRoles(filteredRoles));
  };

  const handleChange = (resource: string, role: RoleItem) => (event: ChangeEvent<HTMLInputElement>) => {
    const actions = selectedRoles[resource] || [];
    const newActions = event.target.checked ? [...actions, role] : actions.filter((action) => action.name !== role.name);
    setFieldValue(fieldName, { ...selectedRoles, [resource]: newActions });
  };


  const handleSelectResource = (resource: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(
      fieldName,
      { ...selectedRoles, [resource]: event.target.checked && allRolesByResource ? allRolesByResource[resource] : [] }
    );
  };

  const checked = (resource: string) => !!selectedRoles[resource]?.length && selectedRoles[resource].length === data?.allRoles[resource].length;
  const indeterminate = (resource: string) => !!selectedRoles[resource]?.length && selectedRoles[resource].length !== data?.allRoles[resource].length;

  return (
    <Stack mt={1} direction="column">
      <FormLabel>Permissions</FormLabel>
      <Paper variant="outlined">
        <Box px={2} py={1} sx={{ backgroundColor: "background.default", borderRadius: "4px" }}>
          <Stack width="50%">
            <InputWithLabel hiddenLabel label="Permissions" placeholder="Search for resources" InputProps={{ onChange: handleSearch }}/>
          </Stack>
        </Box>
        <Box maxHeight={500} overflow="auto" sx={{ borderTop: "1px solid", borderTopColor: "grey.300", py: 1 }}>
          {allRolesByResource && Object.keys(allRolesByResource).length ? Object.keys(allRolesByResource).map((resource) =>
            <Accordion key={resource} disableGutters sx={{ "padding": 0, "&:before": { display: "none" } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={resource}
                sx={{ "minHeight": "auto", "& .MuiAccordionSummary-content": { margin: 0 } }}
              >
                <FormControlLabel
                  label={
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography variant="subtitle1">{`${getResourceLabel(resource)}`}</Typography>
                      <Typography variant="caption">
                        {`(${selectedRoles[resource] ? selectedRoles[resource].length : 0} of ${data?.allRoles[resource]?.length} selected)`}
                      </Typography>
                    </Stack>
                  }
                  control={<Checkbox checked={checked(resource)} indeterminate={indeterminate(resource)} onChange={handleSelectResource(resource)} />}/>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0, pl: 2 }}>
                <Stack direction="column">
                  {allRolesByResource[resource].map((role) =>
                    <FormControlLabel
                      sx={{ ml: 3 }}
                      key={role.name}
                      label={role.label}
                      control={
                        <Checkbox
                          checked={
                            selectedRoles[resource] ? selectedRoles[resource].some(({ name }) => name === role.name) : false}
                          onChange={handleChange(resource, role)}/>}
                    />)}
                </Stack>
              </AccordionDetails>
            </Accordion>) : <Stack justifyContent="center" direction="row">No Roles found</Stack>}
        </Box>
      </Paper>
    </Stack>

  );
};
