import {
  RegisterFormSchema,
  type RegisterFormInput,
} from "@booking-platform/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useRegistrationForm = () => {
  const form = useForm<RegisterFormInput>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(RegisterFormSchema),
  });
  return { ...form, errors: form.formState.errors };
};
