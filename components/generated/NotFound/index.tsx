import React from "react";
import { NotFoundProps } from "@/types";

const NotFound = ({ whatNotFound }: NotFoundProps) => {
  return (
    <div className="w-full flex justify-center items-center gap-6 mt-4 select-none">
      <div className="flex w-1/2 ml-4 flex-col p-8 gap-5 items-start justify-center border border-t-0 border-r-0 border-b-0 border-slate-600 dark:border-slate-100">
        <span className="text-5xl animate-bounce">🧐</span>
        <span className="text-2xl">No {whatNotFound} found</span>
      </div>
    </div>
  );
};

export default NotFound;
