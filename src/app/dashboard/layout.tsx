export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-100 dark:bg-zinc-950">
      {children}
    </div>
  );
}
