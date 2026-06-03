import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col justify-center gap-6 p-6 items-center md:p-10 bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src="/images/logoimage.png"
            alt="image"
            width={30}
            height={30}
          />
          Nodebase
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
