import { useQuery } from "@apollo/client";
import { useContext } from "react";

import { FiltersContextSerializable } from "~/containers/FiltersContextSerializable";
import { Card, Heading } from "~/components";
import { convertToPercentage } from "~/utils/math";
import useQueryReady from "~/hooks/useQueryReady";

import { MandatairesActivityChart } from "./MandatairesActivityChart";
import { MANDATAIRE_ACTIVITY } from "./queries";

function MandatairesActivity(props) {
  const { filters } = useContext(FiltersContextSerializable);
  const { data, error, loading } = useQuery(MANDATAIRE_ACTIVITY, {
    variables: {
      department: filters.departement ? filters.departement : undefined,
      region: filters.region ? parseInt(filters.region) : undefined,
    },
  });

  if (!useQueryReady(loading, error)) {
    return null;
  }

  const service = data.service.aggregate.sum.mesures_in_progress;
  const mandataireIndividuel =
    data.mandataireIndividuel.aggregate.sum.mesures_in_progress;
  const mandatairePrepose =
    data.mandatairePrepose.aggregate.sum.mesures_in_progress;
  const total = service + mandataireIndividuel + mandatairePrepose;

  const activityChartData = {
    mandataireIndividuel: {
      percentage: convertToPercentage(mandataireIndividuel, total),
      sum: mandataireIndividuel,
    },
    mandatairePrepose: {
      percentage: convertToPercentage(mandatairePrepose, total),
      sum: mandatairePrepose,
    },
    service: {
      percentage: convertToPercentage(service, total),
      sum: service,
    },
    total,
  };

  return (
    <Card p="4" {...props}>
      <Heading size={2}>
        Répartition de l’activité par type de mandataires
      </Heading>
      <MandatairesActivityChart data={activityChartData} />
    </Card>
  );
}

export { MandatairesActivity };
