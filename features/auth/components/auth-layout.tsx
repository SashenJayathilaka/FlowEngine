import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10 bg-background overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.185 220) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.185 220) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="relative flex w-full max-w-sm flex-col gap-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-3 self-center group"
        >
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
            <Image
              src="/images/logoimage.png"
              alt="image"
              width={22}
              height={22}
              className="brightness-0 invert"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            NodeBase
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
