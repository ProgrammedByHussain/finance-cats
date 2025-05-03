import React from "react";

export function CatCredentialsPlaque({
  name,
  degree,
  school,
  schoolLogo,
}: {
  name: string;
  degree: string;
  school: string;
  schoolLogo?: string;
}) {
  return (
    <div className="flex flex-col items-center mt-4 mb-6">
      <div className="bg-white/90 border-2 border-catty-orange rounded-xl shadow-md px-8 py-4 flex flex-col items-center min-w-[320px]">
        <div className="flex items-center gap-2 mb-2">
          {schoolLogo && (
            <img
              src={schoolLogo}
              alt={school}
              className="w-7 h-7 object-contain"
            />
          )}
          <span className="text-xl font-bold text-catty-brown">{name}</span>
        </div>
        <span className="text-catty-gray text-base italic mb-1">{degree}</span>
        <span className="text-catty-brown text-sm font-semibold">{school}</span>
      </div>
      <div className="mt-2">
        <span className="inline-block bg-catty-orange text-white text-xs font-semibold rounded-full px-3 py-1 shadow">
          Verified Credentials
        </span>
      </div>
    </div>
  );
} 