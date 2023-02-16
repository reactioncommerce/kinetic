import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { FastField, Field, Form, Formik, FormikConfig } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { client } from "@graphql/graphql-request-client";
import { useShop } from "@containers/ShopProvider";
import { PromotionState, useCreatePromotionMutation, useGetPromotionQuery,
  useUpdatePromotionMutation } from "@graphql/generates";
import { PROMOTION_STACKABILITY_OPTIONS, PROMOTION_TYPE_OPTIONS } from "../constants";
import { Action, Promotion, PromotionType } from "types/promotions";
import { useGlobalBreadcrumbs } from "@hooks/useGlobalBreadcrumbs";
import { TextField } from "@components/TextField";
import { SelectField } from "@components/SelectField";
import { usePermission } from "@components/PermissionGuard";
import { Loader } from "@components/Loader";
import { StatusChip } from "../components/StatusChip";
import { Card } from "@components/Card";
import { useToast } from "@containers/ToastProvider";
import { formatErrorResponse } from "@utils/errorHandlers";
import { useUpdateCouponInPromotion } from "../hooks";

import { ActionButtons } from "./ActionButtons";
import { PromotionActions } from "./PromotionActions";
import { PromotionTriggers } from "./PromotionTriggers";
import { promotionSchema } from "./validation";
import { AvailableDateField } from "./AvailableDateField";
import { PromotionTypeField } from "./PromotionTypeField";
import { formatTriggers, normalizeActionsData, normalizeTriggersData } from "./utils";

type PromotionFormValue = {
  name: string
  description: string
  promotionType: PromotionType
  actions: Action[]
  triggers: Promotion["triggers"]
  stackability: Promotion["stackability"]
  label: string
  startDate: string | null
  endDate: string | null
  enabled: boolean
}


const normalizeFormValues = (values: PromotionFormValue) => {
  const { triggers, coupons } = normalizeTriggersData(values.triggers);
  const normalizedValues = {
    ...values,
    triggers,
    actions: normalizeActionsData(values.actions)
  };

  return { values: normalizedValues, coupons };
};

const formatActions = (actions: Action[]): Action[] => actions.map((action) =>
  ({
    ...action,
    actionParameters: {
      ...action.actionParameters,
      discountMaxUnits: action.actionParameters?.discountMaxUnits || 0,
      discountMaxValue: action.actionParameters?.discountMaxValue || 0
    }
  }));

const PromotionDetails = () => {
  const { promotionId } = useParams();
  const { shopId } = useShop();
  const navigate = useNavigate();
  const canUpdate = usePermission(["reaction:legacy:promotions/update"]);
  const canCreate = usePermission(["reaction:legacy:promotions/create"]);

  const [, setBreadcrumbs] = useGlobalBreadcrumbs();
  const { error } = useToast();

  const { data, isLoading, refetch } = useGetPromotionQuery(client, { input: { _id: promotionId || "id", shopId: shopId! } }, {
    enabled: !!promotionId,
    select: (responseData) => ({ promotion: responseData.promotion as Promotion }),
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

  const { updateCouponInPromotion, createCoupon } = useUpdateCouponInPromotion();

  const onError = (errorResponse: unknown) => {
    const { message } = formatErrorResponse(errorResponse);
    error(message || `Failed to ${promotionId ? "update" : "create"} a promotion.`);
  };

  const onSubmit: FormikConfig<PromotionFormValue>["onSubmit"] = (
    values,
    { setSubmitting }
  ) => {
    const { values: normalizedValues, coupons } = normalizeFormValues(values);

    if (promotionId && data?.promotion) {
      const { triggerType, shopId: promotionShopId } = data.promotion;
      const updatedPromotion = { _id: promotionId, shopId: promotionShopId, triggerType, ...normalizedValues };

      updateCouponInPromotion(data.promotion, coupons);

      updatePromotion(
        { input: updatedPromotion },
        {
          onSettled: () => setSubmitting(false),
          onSuccess: () => {
            refetch();
            setBreadcrumbs((currentBreadcrumbs) =>
              ({ ...currentBreadcrumbs, [`/promotions/${promotionId}`]: updatedPromotion.name }));
          },
          onError
        }
      );
    } else {
      createPromotion({
        input: {
          ...normalizedValues,
          shopId: shopId!
        }
      }, {
        onSettled: () => setSubmitting(false),
        onSuccess: (responseData) => {
          const newPromotionId = responseData.createPromotion?.promotion?._id;
          createCoupon({ newCoupons: coupons, promotionId: newPromotionId, shopId: shopId! });
          newPromotionId ? navigate(`/promotions/${newPromotionId}`) : navigate("/promotions");
        },
        onError
      });
    }
  };

  const initialValues: PromotionFormValue = {
    name: data?.promotion?.name || "",
    description: data?.promotion?.description || "",
    promotionType: (data?.promotion?.promotionType || "order-discount") as PromotionType,
    actions: data?.promotion?.actions ? formatActions(data.promotion.actions) : [],
    triggers: data?.promotion?.triggers ? formatTriggers(
      data.promotion.triggers,
      data?.promotion?.name || "trigger name",
      data?.promotion?.coupon
    ) : [],
    stackability: data?.promotion?.stackability || { key: "none", parameters: {} },
    label: data?.promotion?.label || "",
    startDate: data?.promotion?.startDate || null,
    endDate: data?.promotion?.endDate || null,
    enabled: data?.promotion?.enabled || false
  };

  const showActionButtons = promotionId ? canUpdate : canCreate;
  const shouldDisableField = !!(data?.promotion.enabled && data?.promotion.state === PromotionState.Active);


  if (isLoading) return <Loader/>;

  return (
    <Formik<PromotionFormValue>
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={promotionSchema}
      enableReinitialize
    >
      {({ values, dirty, resetForm, isSubmitting, submitForm }) =>
        <Stack component={Form} direction="column" gap={3} pb={3}>
          <Paper variant="outlined" square sx={{ padding: 3, pb: 0, position: "sticky", top: { xs: 56, sm: 64 }, zIndex: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1}>
              <Stack direction="column" maxWidth="80%" flexWrap="wrap">
                <Stack direction="row" alignItems="center" gap={1.5} mb={0.5} flexWrap="wrap">
                  <Typography variant="h6">{values.name || "New Promotion"}</Typography>
                  {data?.promotion ? <StatusChip promotion={data?.promotion}/> : null}
                </Stack>
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
                    sx={{ color: "grey.600" }}
                    noWrap
                  >
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
                  promotion={data?.promotion}
                  onSuccess={refetch}
                />
                : null}
            </Stack>
            <Tabs value="details">
              <Tab disableRipple value="details" label="Details"/>
            </Tabs>
          </Paper>
          <Stack gap={2} px={3}>
            <Card title="Promotion Basics" divider>
              <Stack sx={{ flexDirection: { sm: "column", md: "row" }, gap: { sm: 0, md: 6 } }} alignItems="flex-start" pt={1} pb={0}>
                <Field name="name" component={TextField} label="Promotion Name"/>
                <PromotionTypeField disabled={shouldDisableField}/>
              </Stack>
              <Field name="description" component={TextField} multiline label="Promotion Notes" minRows={3}/>
            </Card>
            <Card title="Promotion Builder" divider>
              <PromotionActions/>
              <PromotionTriggers disabled={shouldDisableField}/>
            </Card>
            <Card title="Promotion Stackability" divider>
              <Box mt={1} width="50%">
                <FastField
                  name="stackability.key"
                  component={SelectField}
                  label="Select Stackability"
                  options={PROMOTION_STACKABILITY_OPTIONS}/>
              </Box>
            </Card>
            <Card title="Promotion Scheduling" divider>
              <AvailableDateField disabled={shouldDisableField}/>
            </Card>
            <Card title="Promotion Message" divider>
              <Box mt={1} width="50%">
                <FastField
                  name="label"
                  component={TextField}
                  label="Checkout Label"
                />
              </Box>
            </Card>
          </Stack>
        </Stack>
      }
    </Formik>
  );
};

export default PromotionDetails;
