import { useFormik } from "formik";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Flex } from "rebass";

import {
  FormGrayBox,
  FormGroupInput,
  FormGroupSelect,
  FormInputBox,
} from "~/components/AppForm";
import { HeadingTitle } from "~/containers/HeadingTitle";
import { Link } from "~/components/Link";
import { signupMagistratSchema } from "~/validation-schemas";
import { Button, Heading, Text } from "~/components";

import { SignupContext } from "./context";
import signup from "./signup";
import { SignupDatas } from "./SignupDatas";
import { SignupGeneralError } from "./SignupGeneralError";

function SignupMagistratForm({ tiDatas }) {
  const history = useHistory();
  const { user, magistrat, setMagistrat, validateStepOne } =
    useContext(SignupContext);

  const tiOptions = tiDatas.map((ti) => ({
    label: ti.etablissement,
    value: ti.id,
  }));

  const formik = useFormik({
    initialValues: {
      cabinet: magistrat ? magistrat.cabinet : "",
      ti: magistrat ? magistrat.ti : "",
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const body = {
        magistrat: {
          cabinet: values.cabinet,
          ti: values.ti,
        },
        user: user,
      };

      signup({
        body,
        onComplete: () => setSubmitting(false),
        onError: (errors) => setErrors(errors),
        onSuccess: () => history.push("/signup/congratulation"),
      });
    },
    validationSchema: signupMagistratSchema,
  });

  return (
    <>
      <HeadingTitle p="1" m="1">
        {"Création d'un compte de magistrat"}
      </HeadingTitle>
      <form onSubmit={formik.handleSubmit}>
        <SignupGeneralError errors={formik.errors} />
        <Flex>
          <FormGrayBox>
            <Heading size={4}>{"Tribunal"}</Heading>
            <Text lineHeight="1.5" color="textSecondary">
              {"Dans quel tribunal exercez-vous?"}
            </Text>
          </FormGrayBox>
          <FormInputBox>
            <FormGroupSelect
              formik={formik}
              id="ti"
              placeholder="Tribunal d'instance"
              options={tiOptions}
              isClearable={true}
            />

            <FormGroupInput
              id="cabinet"
              placeholder="Cabinet (optionnel)"
              formik={formik}
            />
          </FormInputBox>
        </Flex>

        <Flex justifyContent="flex-end" p={1}>
          <Box>
            <Link to="/">
              <Button mr="2" variant="outline">
                Annuler
              </Button>
            </Link>
          </Box>
          <Box>
            <Button
              mr="2"
              variant="outline"
              onClick={() => {
                setMagistrat(formik.values);
                validateStepOne(false);
              }}
            >
              Retour
            </Button>
          </Box>
          <Box>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
            >
              Enregistrer
            </Button>
          </Box>
        </Flex>
      </form>
    </>
  );
}

const SignupMagistrat = (props) => (
  <SignupDatas
    {...props}
    Component={(props) => <SignupMagistratForm {...props} />}
  />
);

export { SignupMagistrat };
