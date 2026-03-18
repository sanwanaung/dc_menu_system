"use client";

import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldSeparator,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SocialAuth from "@/components/auth/social-auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/auth";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

const SignupCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    const {} = await authClient.signUp.email(
      {
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: "/admin/dashboard",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          console.log("success");
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-md rounded-lg border bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">Hotel QR Ordering</p>
            <p className="text-xs text-muted-foreground">
              Admin & Menu Manager
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl tracking-tight lg:text-center font-normal lg:font-semibold">
          Welcome Back! 👋
        </CardTitle>
        <CardDescription className="lg:text-center">
          Continue with Google or GitHub.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <FieldGroup>
            <SocialAuth />
            <FieldSeparator>OR</FieldSeparator>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  "Signup"
                )}
              </Button>
              <FieldDescription>
                <span className="my-2">
                  Already have an account? <a href="/auth/signin">Sign in</a>
                </span>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <span className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="font-medium text-foreground">Terms</span> and{" "}
          <span className="font-medium text-foreground">Privacy Policy</span>
        </span>
        <p className="text-xs text-muted-foreground">v0.1</p>
      </CardFooter>
    </Card>
  );
};

export default SignupCard;
