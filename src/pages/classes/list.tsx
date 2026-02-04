import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import React from "react";

const ClassesList = () => {
  return (
    <ListView className="class-view">
      <Breadcrumb />

      <div className="intro-row">
        <h1 className="text-2xl font-bold">Classes List</h1>
        <CreateButton />
      </div>
    </ListView>
  );
};

export default ClassesList;
