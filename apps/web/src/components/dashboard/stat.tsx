import React from "react";
import { Card, CardContent } from "../ui/card";

const Stat = ({ name, stat }: { name: string; stat: number }) => {
  return (
    <Card key={`${name}-${stat}`} className="px-1 py-2">
      <CardContent className="py-1 px-4">
        <dt className="text-sm font-medium text-muted-foreground">{name}</dt>
        <dd className="mt-2 flex items-baseline space-x-2.5">
          <span className="text-xl font-semibold text-foreground">{stat}</span>
        </dd>
      </CardContent>
    </Card>
  );
};

export default Stat;
