"use client";
import React from "react";
import { Button } from "./ui/button";
import { refreshPage } from "@/server/refresh";

const RefreshButton = () => {
  return (
    <Button variant={"outline"} size={"sm"} onClick={refreshPage}>
      Refresh
    </Button>
  );
};

export default RefreshButton;
