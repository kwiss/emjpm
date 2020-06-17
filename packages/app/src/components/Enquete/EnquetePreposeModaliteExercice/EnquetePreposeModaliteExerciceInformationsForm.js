import { Heading1, Heading3 } from "@emjpm/ui";
import { Label } from "@rebass/forms";
import React from "react";
import { Box, Flex, Text } from "rebass";

import yup from "../../../lib/validationSchemas/yup";
import { formatFormInput } from "../../../util";
import { PERSONNALITE_JURIDIQUE } from "../constants";
import { EnqueteFormInputField, EnqueteFormSelectField } from "../EnqueteForm";
import { EnqueteStepperButtons } from "../EnqueteStepperButtons";
import { useEnqueteForm } from "../useEnqueteForm.hook";

const validationSchema = yup.object().shape({
  departement: yup.string().required(),
  region: yup.string().required(),
  raison_sociale: yup.string().required(),
  personnalite_juridique_etablissement: yup.string().required(),
  activite_personne_physique: yup.number().min(0).nullable(),
  activite_service: yup.number().min(0).nullable(),
  total_mesures_etablissements: yup.number().min(0).nullable(),
  etablissement_personne_morale: yup.number().min(0).nullable(),
  etablissement_convention_groupement: yup.number().min(0).nullable(),
});

function dataToForm(data) {
  return {
    departement: formatFormInput(data.departement),
    region: formatFormInput(data.region),
    raison_sociale: formatFormInput(data.raison_sociale),
    personnalite_juridique_etablissement: formatFormInput(
      data.personnalite_juridique_etablissement
    ),
    activite_personne_physique: formatFormInput(data.activite_personne_physique),
    activite_service: formatFormInput(data.activite_service),
    total_mesures_etablissements: formatFormInput(data.total_mesures_etablissements),
    etablissement_personne_morale: formatFormInput(data.etablissement_personne_morale),
    etablissement_convention_groupement: formatFormInput(data.etablissement_convention_groupement),
  };
}

function getEtablissementsCount(values) {
  const etablissementPersonneMorale = parseInt(values.etablissement_personne_morale || "0", 10);
  const etablissement = parseInt(values.etablissement_convention_groupement || "0", 10);
  return etablissementPersonneMorale + etablissement;
}

export const EnquetePreposeModaliteExerciceInformationsForm = (props) => {
  const {
    data = {},
    loading = false,
    step,
    onSubmit,
    enqueteContext,
    dispatchEnqueteContextEvent,
  } = props;

  const enqueteForm = useEnqueteForm({
    onSubmit,
    enqueteContext,
    dispatchEnqueteContextEvent,
    data,
    step,
    validationSchema,
    dataToForm,
    loading,
  });

  const { submitForm, values, submit } = enqueteForm;

  return (
    <form onSubmit={submitForm}>
      <Heading1 textAlign="center" mb={"80px"}>
        {"Modalité d'exercice"}
      </Heading1>
      <Heading3>{"Informations générales"}</Heading3>
      <Box mt={4}>
        <Flex alignItems="start">
          <Box mr={1} flex={1 / 2}>
            <EnqueteFormInputField
              id="region"
              label="Région"
              enqueteContext={enqueteContext}
              enqueteForm={enqueteForm}
            />
          </Box>
          <Box ml={1} flex={1 / 2}>
            <EnqueteFormInputField
              id="departement"
              label="Département"
              enqueteContext={enqueteContext}
              enqueteForm={enqueteForm}
            />
          </Box>
        </Flex>

        <EnqueteFormInputField
          id="raison_sociale"
          label="Raison sociale de l'établissement dont dépend le préposé"
          enqueteContext={enqueteContext}
          enqueteForm={enqueteForm}
        />

        <EnqueteFormSelectField
          id="personnalite_juridique_etablissement"
          label="Indiquez la personnalité juridique de l'établissement dont dépend le(s) préposé(s) dans le menu déroulant"
          options={PERSONNALITE_JURIDIQUE.byKey}
          enqueteContext={enqueteContext}
          enqueteForm={enqueteForm}
        />

        <Box>
          <Label>{"L'activité de préposé est exercée par :"}</Label>
          <Flex mt={2} alignItems="start">
            <Flex flex={1 / 2} alignItems="center">
              <EnqueteFormInputField
                id="activite_personne_physique"
                size="small"
                type="number"
                min={0}
                enqueteContext={enqueteContext}
                enqueteForm={enqueteForm}
              >
                <Text ml={3}>personne(s) physique(s)</Text>
              </EnqueteFormInputField>
            </Flex>
            <Flex flex={1 / 2} alignItems="center">
              <EnqueteFormInputField
                id="activite_service"
                size="small"
                type="number"
                min={0}
                enqueteContext={enqueteContext}
                enqueteForm={enqueteForm}
              >
                <Text ml={3}>{"service(s) au sens de l'article L312-1 du CASF"}</Text>
              </EnqueteFormInputField>
            </Flex>
          </Flex>
        </Box>

        <Box>
          <Label>
            {"Nombre d'établissements auprès desquels est exercée l'activité de préposé MJPM :"}
          </Label>
          <Flex mt={2} alignItems="start">
            <Flex flex={1 / 2} alignItems="center">
              <EnqueteFormInputField
                id="etablissement_personne_morale"
                size="small"
                type="number"
                min={0}
                enqueteContext={enqueteContext}
                enqueteForm={enqueteForm}
              >
                <Text ml={3}>établissement(s) dépendant de la même personne morale</Text>
              </EnqueteFormInputField>
            </Flex>
            <Flex flex={1 / 2} alignItems="center">
              <EnqueteFormInputField
                id="etablissement_convention_groupement"
                size="small"
                type="number"
                min={0}
                enqueteContext={enqueteContext}
                enqueteForm={enqueteForm}
              >
                <Text ml={3}>
                  {
                    "établissement(s) dans le cadre d'une convention ou d'un groupement (SIH, GCS, GCSMS, GIP)."
                  }
                </Text>
              </EnqueteFormInputField>
            </Flex>
          </Flex>
        </Box>

        <Box mt={2}>
          <EnqueteFormInputField
            id="total_mesures_etablissements"
            size="small"
            type="number"
            min={0}
            enqueteContext={enqueteContext}
            enqueteForm={enqueteForm}
          >
            <Text
              ml={3}
              dangerouslySetInnerHTML={{
                __html: ` mesure(s) prises en charge par ces <strong>${
                  getEtablissementsCount(values) || ""
                }</strong> établissements`,
              }}
            />
          </EnqueteFormInputField>
        </Box>

        <EnqueteStepperButtons submit={submit} disabled={loading} />
      </Box>
    </form>
  );
};

export default EnquetePreposeModaliteExerciceInformationsForm;
