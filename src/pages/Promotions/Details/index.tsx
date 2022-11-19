import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Field, Form, Formik, FormikConfig } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import * as Yup from "yup";

import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { Stackability, useCreatePromotionMutation, useGetPromotionQuery, useUpdatePromotionMutation } from "@graphql/generates";
import { PROMOTION_TYPE_OPTIONS } from "../constants";
import { PromotionType } from "types/promotions";
import { useGlobalBreadcrumbs } from "@hooks/useGlobalBreadcrumbs";
import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { usePermission } from "@components/PermissionGuard";
import { Loader } from "@components/Loader";

import { ActionButtons } from "./ActionButtons";
import { PromotionSection } from "./PromotionSection";

const promotionSchema = Yup.object().shape({
  name: Yup.string().trim().required("This field is required").max(280, "This field must be at most 280 characters"),
  description: Yup.string().max(5000, "This field must be at most 5000 characters")
});


type PromotionFormValue = {
  name: string
  description: string
  promotionType: string
}

const PromotionDetails = () => {
  const { promotionId } = useParams();
  const { shopId } = useShop();
  const navigate = useNavigate();
  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const canCreate = usePermission(["reaction:legacy:promotions/create"]);

  const [, setBreadcrumbs] = useGlobalBreadcrumbs();

  const { data, isLoading } = useGetPromotionQuery(client, { input: { _id: promotionId || "id", shopId: shopId! } }, {
    enabled: !!promotionId,
    select: (responseData) => ({ promotion: responseData.promotion }),
    onSuccess: (responseData) => {
      const { promotion } = responseData;
      if (promotion) {
        setBreadcrumbs((currentBreadcrumbs) =>
          ({ ...currentBreadcrumbs, [`/promotions/${promotion._id}`]: promotion.name }));
        return;
      }
      navigate("/promotions", { replace: true });
    }
  });

  const { mutate: createPromotion } = useCreatePromotionMutation(client);
  const { mutate: updatePromotion } = useUpdatePromotionMutation(client);

  const onSubmit: FormikConfig<PromotionFormValue>["onSubmit"] = (
    values,
    { setSubmitting, resetForm }
  ) => {
    if (promotionId && data?.promotion) {
      const { referenceId, createdAt, updatedAt, ...rest } = data.promotion;
      const updatedPromotion = { ...rest, ...values };
      updatePromotion(
        { input: updatedPromotion },
        {
          onSettled: () => setSubmitting(false),
          onSuccess: () => {
            resetForm({ values: updatedPromotion });
            setBreadcrumbs((currentBreadcrumbs) =>
              ({ ...currentBreadcrumbs, [`/promotions/${promotionId}`]: updatedPromotion.name }));
          }
        }
      );
    } else {
      createPromotion({
        input: {
          ...values,
          shopId: shopId!,
          startDate: "2022-12-30",
          enabled: false,
          label: "The North Face $5 Special",
          description: "description",
          triggers: [{
            triggerKey: "offers",
            triggerParameters: {
              name: "5 percent off your entire order when you spend more then $200",
              conditions: {
                all: [
                  {
                    fact: "totalItemAmount",
                    operator: "greaterThanInclusive",
                    value: 200
                  }
                ]
              }
            }
          }],
          actions: [
            {
              actionKey: "noop",
              actionParameters: {
                discountType: "order",
                discountCalculationType: "percentage",
                discountValue: 50
              }
            }
          ],
          stackAbility: Stackability.All
        }
      }, {
        onSettled: () => setSubmitting(false),
        onSuccess: (responseData) => {
          const newPromotionId = responseData.createPromotion?.promotion?._id;
          newPromotionId ? navigate(`/promotions/${newPromotionId}`) : navigate("/promotions");
        }
      });
    }
  };

  const initialValues: PromotionFormValue = {
    name: data?.promotion?.name || "",
    description: data?.promotion?.description || "",
    promotionType: data?.promotion?.promotionType || "order-discount"
  };

  const showActionButtons = promotionId ? canUpdate : canCreate;

  return (
    isLoading ? <Loader/> :
      <Formik<PromotionFormValue>
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={promotionSchema}
      >
        {({ values, dirty, resetForm, isSubmitting, submitForm }) => <Stack component={Form} direction="column" gap={3}>
          <Paper variant="outlined" square sx={{ padding: 3, pb: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1}>
              <Stack direction="column" maxWidth="80%" flexWrap="wrap">
                <Typography variant="h6" gutterBottom>{values.name || "New Promotion"}</Typography>
                <Stack direction="row" gap={0.5} alignItems="center">
                  {data?.promotion?.referenceId ?
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "grey.600" }}>
                        {data?.promotion.referenceId}
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
              </Stack>
              {showActionButtons ?
                <ActionButtons
                  loading={isSubmitting}
                  disabled={!dirty}
                  submitForm={submitForm}
                  onCancel={() => (promotionId ? resetForm() : navigate("/promotions"))}
                  promotionId={promotionId}
                />
                : null}
            </Stack>
            <Tabs value="details">
              <Tab disableRipple value="details" label="Details"/>
            </Tabs>
          </Paper>
          <PromotionSection title="Promotion Basics">
            <Stack direction="row" alignItems="center" px={2} pt={1} pb={0} gap={6}>
              <Field name="name" component={TextField} label="Promotion Name"/>
              <Field
                component={SelectField}
                name="promotionType"
                label="Promotion Type"
                options={Object.values(PROMOTION_TYPE_OPTIONS)}
              />
            </Stack>
            <Box px={2}>
              <Field name="description" component={TextField} multiline label="Promotion Notes" minRows={3}/>
            </Box>
          </PromotionSection>
        </Stack>
        }
      </Formik>


  );
};

export default PromotionDetails;
