import { useState, useCallback } from 'react';
import { FormField } from '../classes/FormField';
import { FormValidator } from '../classes/FormValidator';

export function useForm(initialFields: FormField[]) {
  const [validator] = useState(() => new FormValidator(initialFields));
  const [fields, setFields] = useState<FormField[]>(() => validator.cloneFields());

  const handleChange = useCallback(
    (name: string, value: string) => {
      validator.setFieldValue(name, value);
      setFields(validator.cloneFields());
    },
    [validator]
  );

  const handleBlur = useCallback(
    (name: string) => {
      validator.validateField(name);
      setFields(validator.cloneFields());
    },
    [validator]
  );

  const validate = useCallback((): boolean => {
    const isValid = validator.validateAll();
    setFields(validator.cloneFields());
    return isValid;
  }, [validator]);

  const reset = useCallback(() => {
    validator.reset();
    setFields(validator.cloneFields());
  }, [validator]);

  const getValues = useCallback((): Record<string, string> => {
    return validator.getValues();
  }, [validator]);

  return { fields, handleChange, handleBlur, validate, reset, getValues };
}
