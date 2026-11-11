
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
import { Input } from "@/shared/ui/input";
import type { ConfirmEmailInput } from "@booking-platform/shared";
import type { TFunction } from "i18next";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type ConfirmEmailProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  register: UseFormRegister<ConfirmEmailInput>;
  errors: FieldErrors<ConfirmEmailInput>;
  isLoading?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  t: TFunction;
  onResend: () => void;
  resendCooldown: number;
  email: string;
};

const VerifyEmail = ({
  t,
  register,
  errors,
  isLoading,
  onSubmit,
  onResend,
  resendCooldown,
  email,
}: ConfirmEmailProps) => {
  return (
    <section className="bg-foreground dark:bg-background min-h-screen flex items-center relative">
      <div className="pointer-events-none absolute inset-0 right-0 overflow-hidden md:block hidden">
        {/* Outer big circle */}
        <div className="absolute left-1/1 top-0 h-650 w-650 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
        {/* Inner circle */}
        <div className="absolute left-1/1 top-0 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground dark:bg-background" />
      </div>
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="px-6 py-8 sm:p-12 relative">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="">
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-black.svg"
                  alt="shadcnspace"
                  className="dark:hidden h-10 w-10"
                />
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-white.svg"
                  alt="shadcnspace"
                  className="hidden dark:block h-10 w-10"
                />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Verify your email
              </CardTitle>
              <CardDescription className="text-sm font-normal text-muted-foreground">
                We sent a verification code to {email}. Enter it below to
                activate your account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={onSubmit} noValidate>
              <FieldGroup>
                <Field className="gap-4">
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input
                    id="code"
                    inputMode="numeric"
                    aria-invalid={!!errors.code}
                    {...register("code")}
                  />
                  {errors.code && (
                    <FieldError>{errors.code.message}</FieldError>
                  )}
                  <Button
                    type="submit"
                    size={"lg"}
                    disabled={isLoading}
                    className="rounded-xl h-10 hover:bg-primary/80 cursor-pointer"
                  >
                    Verify Now
                  </Button>
                  <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                    Didn&apos;t get the email?{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 font-medium text-card-foreground"
                      onClick={onResend}
                      disabled={resendCooldown > 0}
                    >
                      {resendCooldown > 0
                        ? `Resend (${resendCooldown}s)`
                        : "Resend"}
                    </Button>
                  </FieldDescription>
                </Field>
                {errors.root?.serverError && (
                  <FieldError>{errors.root.serverError.message}</FieldError>
                )}
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VerifyEmail;
