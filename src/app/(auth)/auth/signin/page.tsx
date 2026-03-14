"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { BiLogoGithub } from "react-icons/bi";
import { authClient } from "@/lib/auth-client";

const Signin = () => {
  const handleSignin = async (provider: "google" | "github") => {
    console.log("provider", provider);
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      errorCallbackURL: "/error",
    });
  };

  return (
    <Card className="w-full shadow-lg rounded-2xl py-8 px-6">
      <CardHeader>
        <CardTitle className="text-2xl text-center mb-2 font-mono">
          Welcome back 👋
        </CardTitle>

        <CardDescription className="text-center text-base font-sans">
          Manage your digital menus and restaurant settings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Google Login */}
        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold mb-3 flex items-center justify-center gap-3 cursor-pointer transition hover:bg-muted"
          onClick={() => handleSignin("google")}
        >
          <FcGoogle className="size-5" />
          Sign in with Google
        </Button>

        {/* GitHub Login */}
        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold mb-4 flex items-center justify-center gap-3 cursor-pointer transition hover:bg-muted"
          onClick={() => handleSignin("github")}
        >
          <BiLogoGithub className="size-5" />
          Sign in with GitHub
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t"></div>
          <span className="text-sm text-muted-foreground">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        {/* Email Login */}
        <Button size="lg" className="w-full font-semibold">
          Sign in with Email
        </Button>

        {/* Signup link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Create one
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default Signin;
