import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  count: number;
};

const VariantOptionTotalCard = ({ title, count }: Props) => {
  return (
    <Card size="sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{count}</div>
      </CardContent>
    </Card>
  );
};

export default VariantOptionTotalCard;
