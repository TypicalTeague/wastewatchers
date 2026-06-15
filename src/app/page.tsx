import RoiProjections from "./components/RoiProjections";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950">
      <main className="w-full max-w-3xl px-6 py-20">
        <RoiProjections />
      </main>
    </div>
  );
}
