import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import useQueryReady from "~/hooks/useQueryReady";
import { Card } from "~/components";

import { EDIT_SERVICE } from "./mutations";
import { GET_SERVICES } from "./queries";
import { ServiceEditInformationsForm } from "./ServiceEditInformationsForm";

function ServiceEditInformations({ cancelLink, successLink, serviceId }) {
  const history = useHistory();
  const { data, error, loading } = useQuery(GET_SERVICES, {
    variables: {
      serviceId,
    },
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [editService, { loading: loading2, error: error2 }] = useMutation(
    EDIT_SERVICE,
    {
      onError(error) {
        setErrorMessage(error);
      },
      update() {
        if (successLink) {
          history.push(successLink, successLink, {
            shallow: true,
          });
        }
      },
    }
  );
  useQueryReady(loading2, error2);

  if (!useQueryReady(loading, error)) {
    return null;
  }

  const { services_by_pk: service } = data;

  const handleSubmit = async (values, { setSubmitting }) => {
    await editService({
      refetchQueries: ["CURRENT_USER_QUERY"],
      variables: {
        adresse: values.geocode.label,
        code_postal: values.geocode.postcode,
        competences: values.competences,
        dispo_max: values.dispo_max,
        email: values.email,
        etablissement: values.etablissement,
        latitude: values.geocode.latitude,
        longitude: values.geocode.longitude,
        nom: values.nom,
        prenom: values.prenom,
        service_id: service.id,
        service_tis: values.tis.map((ti) => ({
          service_id: service.id,
          ti_id: ti,
        })),
        telephone: values.telephone,
        ville: values.geocode.city,
      },
    });

    setSubmitting(false);
  };
  return (
    <Card p="5">
      <ServiceEditInformationsForm
        handleSubmit={handleSubmit}
        cancelLink={cancelLink}
        service={service}
        errorMessage={errorMessage}
      />
    </Card>
  );
}

export { ServiceEditInformations };
