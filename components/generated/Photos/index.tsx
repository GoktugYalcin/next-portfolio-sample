import React from "react";
import { IPhoto, IPhotosWrapper } from "@/types";
import { Photo } from "@/components/generated/Photos/Photo";

function Photos(props: IPhotosWrapper) {
  const { data } = props;
  return (
    <div className="grid items-end gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-20 lg:grid-cols-4">
      {data.map((item: IPhoto) => {
        return <Photo key={item.id} {...item} />;
      })}
    </div>
  );
}

export default Photos;
