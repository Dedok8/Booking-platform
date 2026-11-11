import { LoginSchema, type LoginInput } from "@booking-platform/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useLoginForm = () => {
  const form = useForm<LoginInput>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  return { ...form, errors: form.formState.errors };
};
