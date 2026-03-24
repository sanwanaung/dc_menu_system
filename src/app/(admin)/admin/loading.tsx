import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-14 w-full bg-gray-100" />
      </CardHeader>
      <CardContent>
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="flex gap-4" key={index}>
            <Skeleton className="h-10 mt-2 flex-1 bg-gray-100" />
            <Skeleton className="h-10 mt-2 w-24 hidden sm:block bg-gray-100" />
            <Skeleton className="h-10 mt-2 w-20 hidden sm:block bg-gray-100" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Loading;
