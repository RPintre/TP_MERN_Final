export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
};

export class FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder: string;
  value: string;
  error: string | null;
  rules: ValidationRule;
  options?: { label: string; value: string }[];

  constructor(
    name: string,
    label: string,
    type: FieldType = 'text',
    placeholder: string = '',
    rules: ValidationRule = {},
    options?: { label: string; value: string }[]
  ) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.value = '';
    this.error = null;
    this.rules = rules;
    this.options = options;
  }

  setValue(value: string): void {
    this.value = value;
    this.error = null;
  }

  validate(): boolean {
    const { required, minLength, maxLength, min, max, pattern, custom } = this.rules;
    const val = this.value.trim();

    if (required && !val) {
      this.error = `${this.label} est requis.`;
      return false;
    }
    if (minLength && val.length < minLength) {
      this.error = `${this.label} doit contenir au moins ${minLength} caractères.`;
      return false;
    }
    if (maxLength && val.length > maxLength) {
      this.error = `${this.label} ne doit pas dépasser ${maxLength} caractères.`;
      return false;
    }
    if (min !== undefined && Number(val) < min) {
      this.error = `${this.label} doit être supérieur ou égal à ${min}.`;
      return false;
    }
    if (max !== undefined && Number(val) > max) {
      this.error = `${this.label} doit être inférieur ou égal à ${max}.`;
      return false;
    }
    if (pattern && !pattern.test(val)) {
      this.error = `${this.label} n'est pas valide.`;
      return false;
    }
    if (custom) {
      const customError = custom(val);
      if (customError) {
        this.error = customError;
        return false;
      }
    }

    this.error = null;
    return true;
  }

  reset(): void {
    this.value = '';
    this.error = null;
  }

  clone(): FormField {
    const f = new FormField(
      this.name,
      this.label,
      this.type,
      this.placeholder,
      this.rules,
      this.options
    );
    f.value = this.value;
    f.error = this.error;
    return f;
  }
}
