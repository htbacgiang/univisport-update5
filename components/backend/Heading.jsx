import React from "react";

export default function Heading({ title }) {
  return (
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-50">
      {" "}
      {title}
    </h3>
  );
}
