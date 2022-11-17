import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { noop } from "lodash-es";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";

import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { useGetPromotionQuery } from "@graphql/generates";
import { PROMOTION_TYPE_OPTIONS } from "../constants";
import { PromotionType } from "types/promotions";
import { ActionsTriggerButton, MenuActions } from "@components/MenuActions";
import { useGlobalBreadcrumbs } from "@hooks/useGlobalBreadcrumbs";
import { TextField } from "@components/TextField";

type PromotionFormValue = {
  label: string
  description: string
  referenceId: number
  promotionType: string
}

const PromotionDetails = () => {
  const { promotionId } = useParams();
  const { shopId } = useShop();
  const navigate = useNavigate();
  const [_, setBreadcrumbs] = useGlobalBreadcrumbs();

  const { data } = useGetPromotionQuery(client, { input: { _id: promotionId || "id", shopId: shopId! } }, {
    enabled: !!promotionId,
    select: (responseData) => ({ promotion: responseData.promotion }),
    onSuccess: (responseData) => {
      const { promotion } = responseData;
      if (promotion) {
        setBreadcrumbs((currentBreadcrumbs) =>
          ({ ...currentBreadcrumbs, [`/promotions/${promotion._id}`]: promotion.label }));
      }
    }
  });

  const onSubmit = () => {};

  const initialValues: PromotionFormValue = data?.promotion || {
    label: "",
    description: "",
    referenceId: 0,
    promotionType: "order-discount"
  };

  return (
    <Formik<PromotionFormValue>
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize
    >
      {({ values, dirty }) => <Stack component={Form} direction="column" gap={3}>
        <Paper variant="outlined" square sx={{ padding: 3, pb: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1}>
            <Box>
              <Typography variant="h6" gutterBottom>{values.label || "New Promotion"}</Typography>
              <Stack direction="row" gap={0.5} alignItems="center">
                {values.referenceId ?
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "grey.600" }}>
                      {values.referenceId}
                    </Typography>
                    <FiberManualRecordIcon sx={{ height: "5px", width: "5px", color: "grey.600" }} />
                  </>
                  : null}

                <Typography
                  variant="subtitle2"
                  sx={{ color: "grey.600" }}>
                  {PROMOTION_TYPE_OPTIONS[values.promotionType as PromotionType]?.label || "Unknown"}
                </Typography>
              </Stack>
            </Box>
            {!promotionId || dirty ?
              <Stack direction="row" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/promotions")}
                >
                  Cancel
                </Button>
                <LoadingButton
                  size="small"
                  variant="contained"
                  disabled={!dirty}
                >
                Save Changes
                </LoadingButton>
              </Stack>
              :
              <MenuActions
                options={
                  [
                    { label: "Edit", onClick: noop },
                    { label: "Enable", onClick: noop },
                    { label: "Duplicate", onClick: noop },
                    { label: "Delete", onClick: noop }
                  ]
                }
                renderTriggerButton={(onClick) => <ActionsTriggerButton onClick={onClick}/>}
              />
            }
          </Stack>
          <Tabs value="details">
            <Tab disableRipple value="details" label="Details"/>
          </Tabs>
        </Paper>
        <Container maxWidth={false}>
          <Paper variant="outlined" sx={{ py: 1 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ pl: 2 }}>Promotion Basics</Typography>
            <Divider/>
            <Stack direction="row" alignItems="center" px={2} pt={1} pb={0} gap={6}>
              <Field name="label" component={TextField} label="Promotion Name"/>
              <Field name="promotionType" component={TextField} label="Promotion Type"/>
            </Stack>
            <Box px={2}>
              <Field name="description" component={TextField} multiline label="Promotion Notes" minRows={3}/>
            </Box>
          </Paper>
        </Container>

      </Stack>
      }
    </Formik>


  );
};

export default PromotionDetails;
