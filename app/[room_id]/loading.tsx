import React from "react";

export default function Loading() {
  return (
    <div className="appbg h-screen animate-pulse">
      <div className="mx-auto max-w-lg space-y-2 pt-20">
        <div className="h-10 rounded-lg bg-gray-200"></div>
        <div className="h-10 rounded-lg bg-gray-200"></div>
        <div className="h-10 rounded-lg bg-gray-200"></div>
      </div>
      <div className="mx-auto mt-5 h-60 w-full max-w-3xl rounded-lg bg-gray-200"></div>
      <div className="ml-16 mt-16">
        <h1 className="h-10 max-w-[200px] rounded-lg bg-gray-200"></h1>
        <div className="mt-4 grid grid-cols-6 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="col-span-1 h-14 rounded-lg bg-gray-200"
              key={item}
            ></div>
          ))}
        </div>
      </div>
      <div>
        <div className="mx-auto mt-20 h-14 max-w-[170px] rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
}
