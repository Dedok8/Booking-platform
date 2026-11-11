import {
  ConfirmEmailSchema,
  type ConfirmEmailInput,
} from "@booking-platform/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useConfirmEmailForm = (email: string) => {
  const form = useForm<ConfirmEmailInput>({
    mode: "onBlur",
    defaultValues: { email, code: "" },
    resolver: zodResolver(ConfirmEmailSchema),
  });

  return { ...form, errors: form.formState.errors };
};
