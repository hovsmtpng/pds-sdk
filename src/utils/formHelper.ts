import { z, ZodTypeAny, ZodObject } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "radio"
  | "otp"
  | "checkbox"
  | "switch"
  | "date"
  | "daterange";

export interface FieldConfig {
  name: string;
  type: FieldType;
  validation: ZodTypeAny;
}

type DefaultValues = Record<string, any>;

/**
 * Build Zod schema secara dinamis
 */
export const schema = (fields: FieldConfig[]): ZodObject<any> => {
  const shape = fields.reduce<Record<string, ZodTypeAny>>((acc, field) => {
    acc[field.name] = field.validation;
    return acc;
  }, {});

  return z.object(shape);
};

/**
 * Generate default values secara dinamis
 */
export const defaultValues = (fields: FieldConfig[]): DefaultValues => {
  return fields.reduce<DefaultValues>((acc, field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "textarea":
      case "select":
      case "radio":
      case "otp":
        acc[field.name] = "";
        break;

      case "checkbox":
        acc[field.name] = [];
        break;

      case "switch":
        acc[field.name] = false;
        break;

      case "date":
        acc[field.name] = null;
        break;

      case "daterange":
        acc[field.name] = { from: null, to: null };
        break;

      default:
        acc[field.name] = "";
    }

    return acc;
  }, {});
};