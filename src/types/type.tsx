import { FieldValues, useForm, UseFormRegister } from "react-hook-form";

// login types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Session {
  user: User;
  accessToken: string;
}
// form types for input fields in a form component

export type Props<T extends Record<string, any> = any> = {
  name: string;
  type: "text" | "password";
  register: UseFormRegister<T>;
  error?: string | undefined;
};

export type FieldType = "text" | "password";

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
};

export type AuthProps = {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
};
