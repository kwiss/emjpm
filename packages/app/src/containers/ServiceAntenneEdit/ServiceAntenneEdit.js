import { useMutation } from "@apollo/client";

import { useHistory } from "react-router-dom";

import { ServiceAntenneForm } from "~/containers/ServiceAntenneForms";
import { Card } from "~/components";
import { captureException } from "~/user/sentry";

import { EDIT_ANTENNE } from "./mutations";
import useQueryReady from "~/hooks/useQueryReady";

function ServiceAntenneEdit(props) {
  const history = useHistory();
  const { user, antenneId } = props;
  const { service_members } = user;
  const [{ service }] = service_members;
  const { service_antennes } = service;
  const [antenne] = service_antennes.filter((s) => s.id === antenneId);

  const [editAntenne, { loading, error }] = useMutation(EDIT_ANTENNE);
  useQueryReady(loading, error);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await editAntenne({
        refetchQueries: ["CURRENT_USER_QUERY"],
        variables: {
          adresse: values.geocode.label,
          antenne_id: antenneId,
          code_postal: values.geocode.postcode,
          contact_email: values.contact_email,
          contact_firstname: values.contact_firstname,
          contact_lastname: values.contact_lastname,
          contact_phone: values.contact_phone,
          latitude: values.geocode.latitude,
          longitude: values.geocode.longitude,
          mesures_max: values.mesures_max,
          name: values.name,
          service_id: service.id,
          user_id: user.id,
          ville: values.geocode.city,
        },
      });
    } catch (error) {
      captureException(error);
      // TODO(plaunay) display "Une erreur est survenue, veuillez réessayer plus tard."
    }

    setSubmitting(false);
    history.push(`/services/antennes/${antenneId}`);
  };

  return (
    <Card p="5">
      <ServiceAntenneForm antenne={antenne} handleSubmit={handleSubmit} />
    </Card>
  );
}

export { ServiceAntenneEdit };
