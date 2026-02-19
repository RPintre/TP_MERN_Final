import { FormField } from './FormField';

export class FormValidator {
  private fields: Map<string, FormField>;

  constructor(fields: FormField[]) {
    this.fields = new Map(fields.map((f) => [f.name, f]));
  }

  getField(name: string): FormField | undefined {
    return this.fields.get(name);
  }

  getAllFields(): FormField[] {
    return Array.from(this.fields.values());
  }

  setFieldValue(name: string, value: string): void {
    const field = this.fields.get(name);
    if (field) {
      field.setValue(value);
    }
  }

  validateAll(): boolean {
    let isValid = true;
    this.fields.forEach((field) => {
      if (!field.validate()) {
        isValid = false;
      }
    });
    return isValid;
  }

  validateField(name: string): boolean {
    const field = this.fields.get(name);
    return field ? field.validate() : true;
  }

  getValues(): Record<string, string> {
    const values: Record<string, string> = {};
    this.fields.forEach((field, key) => {
      values[key] = field.value;
    });
    return values;
  }

  hasErrors(): boolean {
    return Array.from(this.fields.values()).some((f) => f.error !== null);
  }

  reset(): void {
    this.fields.forEach((field) => field.reset());
  }

  reinitialize(fields: FormField[]): void {
    this.fields = new Map(fields.map((f) => [f.name, f]));
  }

  cloneFields(): FormField[] {
    return Array.from(this.fields.values()).map((f) => f.clone());
  }
}
