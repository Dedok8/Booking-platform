import { cn } from "cn";
import { useState } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import type { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import type { TFunction } from "i18next";
import type { ChangePasswordInput } from "@booking-platform/shared";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group";

type PasswordFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete: string;
  icon: React.ReactNode;
  description?: string;
};

function PasswordField({
  id,
  label,
  registration,
  error,
  autoComplete,
  icon,
  description,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup aria-invalid={!!error}>
        <InputGroupAddon>{icon}</InputGroupAddon>
        <InputGroupInput
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          {...registration}
        />
        <InputGroupButton
          type="button"
          aria-label={`${show ? "Hide" : "Show"} ${label.toLowerCase()}`}
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </InputGroupButton>
      </InputGroup>
      {error && <FieldError>{error}</FieldError>}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

type ChangePasswordFormProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  register: (name: keyof ChangePasswordInput) => UseFormRegisterReturn;
  errors: FieldErrors<ChangePasswordInput>;
  isLoading?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  t: TFunction;
};

export function ChangePasswordForm({
  register,
  errors,
  isLoading,
  onSubmit,
  t,
  className,
  ...props
}: ChangePasswordFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Change password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <PasswordField
                id="currentPassword"
                label="Current password"
                autoComplete="current-password"
                icon={<Lock className="size-4" />}
                registration={register("currentPassword")}
                error={errors.currentPassword?.message}
              />
              <PasswordField
                id="newPassword"
                label="New password"
                autoComplete="new-password"
                icon={<Shield className="size-4" />}
                description="At least 8 characters with uppercase, lowercase, and a number"
                registration={register("newPassword")}
                error={errors.newPassword?.message}
              />

              {errors.root?.serverError && (
                <FieldError>{errors.root.serverError.message}</FieldError>
              )}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? t("auth.changePasswordLoading")
                    : t("auth.changePassword")}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
