import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { Box, Flex, Text } from "rebass";

import { GESTIONNAIRES } from "~/containers/MagistratMesureMandataire/queries";
import { MAGISTRAT_MESURES_QUERY } from "~/containers/MagistratMesures/queries";
import useUser from "~/hooks/useUser";
import { magistratMesureDeleteSchema } from "~/validation-schemas";
import { Button, Heading, InlineError, Input } from "~/components";

import { CALCULATE_MESURES, DELETE_MESURE } from "./mutations";
import { MagistratMesureRemoveStyle } from "./style";
import useQueryReady from "~/hooks/useQueryReady";

export function MagistratMesureDeleteForm(props) {
  const { mesure } = props;
  const { serviceId, mandataireId } = mesure;

  const history = useHistory();

  const {
    magistrat: { ti_id: tiId },
  } = useUser();

  const [recalculateMesures, { loading: loading1, error: error1 }] =
    useMutation(CALCULATE_MESURES);
  useQueryReady(loading1, error1);

  const [deleteMesure, { loading: loading2, error: error2 }] = useMutation(
    DELETE_MESURE,
    {
      onCompleted: async () => {
        await recalculateMesures({
          refetchQueries: [
            {
              query: GESTIONNAIRES,
              variables: {
                mandataire_id: mandataireId,
                service_id: serviceId,
              },
            },
          ],
          variables: {
            mandataireId,
            serviceId,
          },
        });

        history.push("/magistrats/mesures");
      },
    }
  );
  useQueryReady(loading2, error2);

  const formik = useFormik({
    initialValues: {
      reason_delete: "",
    },
    onSubmit: async (_, { setSubmitting }) => {
      await deleteMesure({
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: MAGISTRAT_MESURES_QUERY,
            variables: {
              natureMesure: null,
              offset: 0,
              searchText: null,
              tiId: tiId,
            },
          },
        ],
        variables: {
          mesureId: mesure.id,
        },
      });

      setSubmitting(false);
    },
    validationSchema: magistratMesureDeleteSchema,
  });

  return (
    <Flex sx={MagistratMesureRemoveStyle}>
      <Box bg="cardSecondary" p="5" width={[1, 3 / 5]}>
        <Heading size={5} mb="1">
          Supprimer la mesure
        </Heading>
        <Text mb="2" lineHeight="1.5">
          {
            "Vous êtes sur le point de supprimer définitivement une mesure réservée du système eMJPM. Toute suppression est irréversible."
          }
        </Text>
        <Text lineHeight="1.5">
          {
            'Si vous souhaitez supprimer cette mesure réservée, cliquez sur "Supprimer la mesure".'
          }
        </Text>
        <Text lineHeight="1.5">
          {'Dans le cas contraire, cliquez sur "Annuler".'}
        </Text>
      </Box>
      <Box p="5" width={[1, 2 / 5]}>
        <Box mb="3">
          <Heading size={3}>Supprimer la mesure</Heading>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Box mb="2">
            <Input
              value={formik.values.reason_delete}
              hasError={
                formik.errors.reason_delete && formik.touched.reason_delete
              }
              id="reason_delete"
              name="reason_delete"
              onChange={formik.handleChange}
              placeholder="Raison de la suppression"
            />
            <InlineError
              message={formik.errors.reason_delete}
              fieldId="reason_delete"
            />
          </Box>
          <Flex justifyContent="flex-end">
            <Box>
              <Button
                type="button"
                mr="2"
                variant="outline"
                onClick={() => {
                  history.push(`/magistrats/mesures/${mesure.id}`);
                }}
              >
                Annuler
              </Button>
            </Box>
            <Box>
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
              >
                Supprimer la mesure
              </Button>
            </Box>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
