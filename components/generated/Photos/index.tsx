import React from "react";
import { IPhoto, IPhotosWrapper } from "@/types";
import { Photo } from "@/components/generated/Photos/Photo";

function Photos(props: IPhotosWrapper) {
  const { data } = props;
  return (
    <div className="grid grid-cols-2 items-end gap-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-16">
      {data.map((item: IPhoto) => {
        return <Photo key={item.id} {...item} />;
      })}
    </div>
  );
}

export default Photos;
