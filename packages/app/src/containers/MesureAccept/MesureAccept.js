import { useApolloClient, useMutation } from "@apollo/client";
import { isFrance } from "@emjpm/biz";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "rebass";

import { MesureContext } from "~/containers/MesureContext";
import { MESURE_CONTEXT_QUERY } from "~/containers/MesureContext/queries";
import useUser from "~/hooks/useUser";
import { getUserBasePath } from "~/constants";
import getLocation from "~/query-service/emjpm-hasura/getLocation";

import { MesureAcceptForm } from "./MesureAcceptForm";
import { ACCEPT_MESURE, CALCULATE_MESURES } from "./mutations";
import { MesureAcceptStyle } from "./style";
import useQueryReady from "~/hooks/useQueryReady";

export function MesureAccept(props) {
  const history = useHistory();
  const client = useApolloClient();

  const mesure = useContext(MesureContext);
  const currentUser = useUser();

  const { service = {}, type } = currentUser;
  const { service_antennes = [] } = service;
  const { mandataireId, serviceId, id } = mesure;

  const userBasePath = getUserBasePath({ type });

  const [recalculateMesures, { loading: loading1, error: error1 }] =
    useMutation(CALCULATE_MESURES);
  useQueryReady(loading1, error1);

  function redirectToMesure(mesureId) {
    history.push(`${userBasePath}/mesures/${mesureId}`);
  }

  const [updateMesure, { loading: loading2, error: error2 }] = useMutation(
    ACCEPT_MESURE,
    {
      onCompleted: async () => {
        await recalculateMesures({
          refetchQueries: ["CURRENT_USER_QUERY"],
          variables: { mandataireId, serviceId },
        });
        redirectToMesure(mesure.id);
      },
    }
  );
  useQueryReady(loading2, error2);

  const antenneOptions = service_antennes.map((antenne) => ({
    label: antenne.name,
    value: antenne.id,
  }));

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const variables = {};

    if (isFrance(values.pays)) {
      const location = await getLocation(client, {
        city: values.ville,
        zipcode: values.code_postal,
      });

      if (!location || !location.department) {
        setErrors({
          zipcode: "Le code postal semble invalide.",
        });
        return setSubmitting(false);
      } else {
        const { department, geolocation } = location;
        variables.code_postal = values.code_postal;
        variables.ville = values.ville.toUpperCase();
        variables.latitude = geolocation ? geolocation.latitude : null;
        variables.longitude = geolocation ? geolocation.longitude : null;
        variables.departement_code = department.id;
      }
    }

    await updateMesure({
      refetchQueries: [
        {
          query: MESURE_CONTEXT_QUERY,
          variables: {
            id: mesure.id,
          },
        },
        "MESURES_QUERY",
      ],
      variables: {
        ...variables,
        antenne_id: values.antenne ? Number.parseInt(values.antenne) : null,
        champ_mesure: mesure.champMesure ? mesure.champMesure : null,
        date_nomination: values.date_nomination,
        id,
        lieu_vie: values.lieu_vie,
        nature_mesure: mesure.natureMesure,
        pays: values.pays,
      },
    });
    setSubmitting(false);
  };

  function handleCancel() {
    redirectToMesure(mesure.id);
  }

  return (
    <Box sx={MesureAcceptStyle} {...props}>
      <MesureAcceptForm
        antenneOptions={antenneOptions}
        userBasePath={userBasePath}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        mt="3"
        mesure={mesure}
      />
    </Box>
  );
}

export default MesureAccept;
