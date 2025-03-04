import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { ServiceAntenneForm } from "~/containers/ServiceAntenneForms";
import useUser from "~/hooks/useUser";
import { Card } from "~/components";
import { captureException } from "~/user/sentry";

import { CREATE_ANTENNE } from "./mutations";
import useQueryReady from "~/hooks/useQueryReady";

function ServiceCreateAntenne() {
  const history = useHistory();
  const { service_members } = useUser();
  const [currentUserService] = service_members;
  const { service_id } = currentUserService;

  const [createAntenne, { loading, error }] = useMutation(CREATE_ANTENNE);
  useQueryReady(loading, error);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await createAntenne({
        refetchQueries: ["CURRENT_USER_QUERY"],
        variables: {
          adresse: values.geocode.label,
          code_postal: values.geocode.postcode,
          contact_email: values.contact_email,
          contact_firstname: values.contact_firstname,
          contact_lastname: values.contact_lastname,
          contact_phone: values.contact_phone,
          latitude: values.geocode.latitude,
          longitude: values.geocode.longitude,
          mesures_max: values.mesures_max,
          name: values.name,
          service_id: service_id,
          ville: values.geocode.city,
        },
      });
    } catch (error) {
      captureException(error);
      // TODO(plaunay) display "Une erreur est survenue, veuillez réessayer plus tard."
    }

    setSubmitting(false);
    history.push("/services/informations");
  };

  return (
    <Card p="5">
      <ServiceAntenneForm handleSubmit={handleSubmit} />
    </Card>
  );
}

export { ServiceCreateAntenne };
