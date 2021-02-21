import { Box, Flex } from "rebass";

import { Field, InputYear } from "~/components";

import AppFormFieldErrorMessage from "./AppFormFieldErrorMessage";
import useAppFieldShowError from "./useAppFieldShowError";

export default function FormGroupInputYear({
  id,
  value,
  placeholder,
  error,
  children,
  readOnly,
  formik,
  hideErrors,
  validationSchema,
  onChange,
  ...props
}) {
  const { handleBlur, values } = formik;

  if (value === undefined) {
    value = values[id];
  }

  const showError = useAppFieldShowError({
    error,
    formik,
    hideErrors,
    id,
  });

  return (
    <Field>
      <Flex alignItems="center">
        <InputYear
          placeholderText={placeholder}
          readOnly={readOnly}
          id={id}
          name={id}
          value={value}
          onBlur={handleBlur}
          onChange={
            onChange ? onChange : (value) => formik.setFieldValue(id, value)
          }
          {...props}
        />
        {children ? <Box>{children}</Box> : null}
      </Flex>

      <AppFormFieldErrorMessage
        id={id}
        error={error}
        formik={formik}
        hideErrors={hideErrors}
      />
    </Field>
  );
}
