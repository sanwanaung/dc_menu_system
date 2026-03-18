"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BiLogoGithub } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type SocialProvider = "google" | "github";

const SocialAuth = () => {
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(
    null,
  );

  const isSocialLoading = socialProvider !== null;

  const handleSignin = async (provider: SocialProvider) => {
    setSocialProvider(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/admin/dashboard",
        errorCallbackURL: "/error",
      });
    } catch {
      console.log("something went wrong with signing in with " + provider);
    } finally {
      setSocialProvider(null);
    }
  };

  return (
    <>
      <Field>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-3 rounded-xl"
          onClick={() => handleSignin("google")}
          disabled={isSocialLoading}
        >
          {socialProvider === "google" ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <FcGoogle className="size-5" aria-hidden="true" />
          )}
          <span className="flex-1 lg:flex-0 text-left lg:text-center">
            {socialProvider === "google"
              ? "Continuing with Google..."
              : "Continue with Google"}
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full gap-3 rounded-xl"
          onClick={() => handleSignin("github")}
          disabled={isSocialLoading}
        >
          {socialProvider === "github" ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <BiLogoGithub className="size-5" aria-hidden="true" />
          )}
          <span className="flex-1 lg:flex-0 text-left lg:text-center">
            {socialProvider === "github"
              ? "Continuing with GitHub..."
              : "Continue with GitHub"}
          </span>
        </Button>
      </Field>
    </>
  );
};

export default SocialAuth;
