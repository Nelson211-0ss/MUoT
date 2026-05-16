import { LoginPortal } from "@/components/portal/LoginPortal";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-white via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <LoginPortal />
    </div>
  );
}
