import React from "react";

export default function Root() {
  const user = localStorage.getItem("user");

  if (!user)
    return (
      <div className="flex font-bold">
        <div>Hello</div>
      </div>
    );

  return (
    <>
      <div>hello</div>
    </>
  );
}
