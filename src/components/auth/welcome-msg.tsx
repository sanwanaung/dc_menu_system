import { BarChart3, ShieldCheck, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import logo from "./../../../public/logo.png";

const WelcomeMsg = () => {
  return (
    <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden rounded-lg border bg-muted/30 p-10 lg:flex">
      <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-chart-1/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-full shadow-sm">
            {/* <Sparkles className="size-5" aria-hidden="true" /> */}
            <Image
              src={logo}
              alt="logo"
              width={1000}
              height={800}
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">Hotel QR Ordering</p>
            <p className="text-xs text-muted-foreground">
              Admin & Menu Manager
            </p>
          </div>
        </div>

        <h1 className="mt-8 text-balance text-3xl font-semibold tracking-tight">
          Welcome back.
        </h1>
        <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground">
          Sign in with your preferred provider to manage menus, orders, and
          insights.
        </p>

        <ul className="mt-8 space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 grid size-7 place-items-center rounded-lg bg-background/60 ring-1 ring-foreground/10">
              <UtensilsCrossed
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-medium">Menus in minutes</p>
              <p className="text-muted-foreground">
                Update items, pricing, variants, and availability.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 grid size-7 place-items-center rounded-lg bg-background/60 ring-1 ring-foreground/10">
              <BarChart3
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-medium">Actionable analytics</p>
              <p className="text-muted-foreground">
                Understand what sells and what needs attention.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="mt-0.5 grid size-7 place-items-center rounded-lg bg-background/60 ring-1 ring-foreground/10">
              <ShieldCheck
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-medium">Secure access</p>
              <p className="text-muted-foreground">
                Social sign-in and modern session handling.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default WelcomeMsg;
