import Typography from "@mui/material/Typography";

import { DestinationRestrictions, SurchargeDestinationRestrictions } from "@graphql/types";

type DestinationCellProps = {
  data?: SurchargeDestinationRestrictions | DestinationRestrictions
}

export const DestinationCell = ({ data }: DestinationCellProps) => {
  const totalCountry = data?.country?.length ?? 0;
  const totalPostal = data?.postal?.length ?? 0;
  const totalRegion = data?.region?.length ?? 0;
  const totalDestinations = totalCountry + totalRegion + totalPostal;

  return (
    <Typography noWrap variant="body2">
      {totalDestinations === 1
        ? "1 Destination"
        : `${totalDestinations} Destinations`}
    </Typography>
  );
};
