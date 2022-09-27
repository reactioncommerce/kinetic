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

type RoleItem = {
  name: string
  label: string
}

const normalizeRoles = (roleNames: string[]) => {
  const groupedRoleByResource = roleNames.reduce((roleByResource, roleName) => {
    const [resource, action] = roleName.split("/");
    (roleByResource[resource] || (roleByResource[resource] = [])).push({ name: roleName, label: startCase(action) });
    return roleByResource;
  }, {} as Record<string, RoleItem[]>);

  return groupedRoleByResource;
};

const getResourceLabel = (name: string) => startCase(name.split(":")[2] || "Unknown");

type RoleSelectFieldProps = FieldProps<Record<string, string[]>> & {
  predefinedRoles: string[]
}

export const RoleSelectField = ({ field: { value: selectedRoles, name: fieldName }, form: { setFieldValue }, predefinedRoles }: RoleSelectFieldProps) => {
  const { shopId } = useShop();
  const { data } = useGetRolesQuery(client, { shopId: shopId! });
  const roleNames = [...new Set(filterNodes(data?.roles?.nodes).map(({ name }) => name).concat(predefinedRoles))];

  const [allRolesByResource, setRolesByResource] =
  useState(normalizeRoles(roleNames));

  const handleSearch = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const search = event.target.value;
    const filteredRoles = roleNames.filter((roleName) => roleName.includes(search.toLowerCase()));
    setRolesByResource(normalizeRoles(filteredRoles));
  };

  const handleChange = (resource: string, roleName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const actions = selectedRoles[resource] || [];
    const newActions = event.target.checked ? [...actions, roleName] : actions.filter((action) => action !== roleName);
    setFieldValue(fieldName, { ...selectedRoles, [resource]: newActions });
  };


  const handleSelectResource = (resource: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(
      fieldName,
      { ...selectedRoles, [resource]: event.target.checked ? allRolesByResource[resource].map(({ name }) => name) : [] }
    );
  };

  const checked = (resource: string) => !!selectedRoles[resource]?.length && selectedRoles[resource].length === allRolesByResource[resource].length;
  const indeterminate = (resource: string) => !!selectedRoles[resource]?.length && selectedRoles[resource].length !== allRolesByResource[resource].length;

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
          {Object.keys(allRolesByResource).map((resource) =>
            <Accordion key={resource} disableGutters sx={{ "padding": 0, "&:before": { display: "none" } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={resource}
                sx={{ "minHeight": "auto", "& .MuiAccordionSummary-content": { margin: 0 } }}
              >
                <FormControlLabel
                  label={<Typography variant="subtitle1">{getResourceLabel(resource)}</Typography>}
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
                            selectedRoles[resource] ? selectedRoles[resource].includes(role.name) : false}
                          onChange={handleChange(resource, role.name)}/>}
                    />)}
                </Stack>
              </AccordionDetails>
            </Accordion>)}
        </Box>
      </Paper>
    </Stack>

  );
};
