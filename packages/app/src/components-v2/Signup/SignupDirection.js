import { Heading1, Heading4, Button, Card, Select, Text } from "@socialgouv/emjpm-ui-core";
import { Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import React, { useContext } from "react";
import { Box, Flex } from "rebass";
import * as Yup from "yup";
import { DIRECTION_TYPE_LABEL_VALUE } from "../../constants/direction";
import { SignupContext } from "./context";
import signup from "./signup";
import { SignupGeneralError } from "./SignupGeneralError";
import { grayBox, cardStyle } from "./style";

export const SignupDirection = () => {
  const { user, direction, setDirection, validateStepOne } = useContext(SignupContext);

  return (
    <Card sx={cardStyle}>
      <Flex flexDirection="column">
        <Box pl={5} pb={3}>
          <Heading1>{`Création d'un compte d'agent de l'état`}</Heading1>
        </Box>
        <Flex>
          <Box width={[1, 2 / 5]} sx={grayBox}>
            <Box height="80px" pt={1}>
              <Heading4>{`Institution`}</Heading4>
              <Text lineHeight="1.5" color="textSecondary">
                {`Pour quelle direction travaillez-vous?`}
              </Text>
            </Box>
          </Box>
          <Box p="5" pb={0} width={[1, 3 / 5]}>
            <Box sx={{ zIndex: "1", position: "relative" }} mb="2">
              <Formik
                onSubmit={(values, { setSubmitting, setErrors }) => {
                  const body = {
                    direction: {
                      directionType: values.directionType.value
                    },
                    user: {
                      username: user.email,
                      ...user
                    }
                  };
                  signup({
                    body,
                    onSuccess: () => Router.push("/signup/congratulation"),
                    onError: errors => setErrors(errors),
                    onComplete: () => setSubmitting(false)
                  });
                }}
                validationSchema={Yup.object().shape({
                  directionType: Yup.string().required("Champs obligatoire")
                })}
                initialValues={{
                  directionType: direction ? direction.directionType : ""
                }}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <SignupGeneralError errors={props.errors} />
                      <Box sx={{ zIndex: "110", position: "relative" }} mb="2">
                        <Select
                          id="directionType"
                          name="directionType"
                          placeholder="Type de direction"
                          value={values.directionType}
                          hasError={errors.directionType && touched.directionType}
                          onChange={option => setFieldValue("directionType", option)}
                          options={DIRECTION_TYPE_LABEL_VALUE}
                        />
                        {errors.cabinet && touched.cabinet && <Text>{errors.cabinet}</Text>}
                      </Box>
                      <Flex justifyContent="flex-end">
                        <Box>
                          <Button mr="2" variant="outline">
                            <Link href="/">
                              <a>Annuler</a>
                            </Link>
                          </Button>
                        </Box>
                        <Box>
                          <Button
                            mr="2"
                            variant="outline"
                            onClick={() => {
                              setDirection(values);
                              validateStepOne(false);
                            }}
                          >
                            <a>Retour</a>
                          </Button>
                        </Box>
                        <Box>
                          <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                            Enregistrer
                          </Button>
                        </Box>
                      </Flex>
                    </form>
                  );
                }}
              </Formik>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
};
