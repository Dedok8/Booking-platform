import {
  ChangePasswordSchema,
  type ChangePasswordInput,
} from "@booking-platform/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useChangePasswordForm = () => {
  const form = useForm<ChangePasswordInput>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  return { ...form, errors: form.formState.errors };
};
