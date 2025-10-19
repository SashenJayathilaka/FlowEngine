import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  return (
    <div className="w-screen h-screen bg-black text-white text-6xl">
      <p>Hello</p>
    </div>
  );
}
