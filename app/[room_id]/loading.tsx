import React from "react";

export default function Loading() {
  return (
    <div className="appbg h-full min-h-screen animate-pulse px-6">
      <div className="mx-auto max-w-screen-xl space-y-2 px-8 pt-20">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <div className="mx-auto h-16 w-full max-w-[220px] rounded-lg bg-gray-300"></div>
          <div className="h-8 rounded-lg bg-gray-300"></div>
          <div className="h-28 rounded-lg bg-gray-300"></div>
        </div>
      </div>
      <div className="mx-auto mt-10 h-60 w-full max-w-screen-xl rounded-lg bg-gray-300"></div>

      <div className="mx-auto mt-16 max-w-screen-xl pb-16">
        <h1 className="h-10 max-w-[200px] rounded-lg bg-gray-300"></h1>
        <div className="mt-4 grid grid-cols-2 gap-2 pb-16 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              className="col-span-1 h-14 rounded-lg bg-gray-300"
              key={item}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
