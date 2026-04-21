import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccessDeniedCard({
  title = "Analytics",
  reason,
}: {
  title?: string;
  reason: "unauthenticated" | "forbidden";
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-10 text-sm text-muted-foreground">
        {reason === "unauthenticated" ? (
          <div className="space-y-3">
            <div>You need to sign in to view analytics.</div>
            <Button asChild size="sm">
              <Link href="/auth/signin">Go to sign in</Link>
            </Button>
          </div>
        ) : (
          <div>You don&apos;t have permission to view this analytics view.</div>
        )}
      </CardContent>
    </Card>
  );
}

