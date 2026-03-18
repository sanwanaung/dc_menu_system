import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoon({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-10 text-sm text-muted-foreground">
        Coming soon. This section will be implemented later.
      </CardContent>
    </Card>
  );
}

