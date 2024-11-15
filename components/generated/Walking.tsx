"use client";
import React, { useEffect, useState } from "react";

export const Walking: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <span className={"anim"} /> : <></>;
};
