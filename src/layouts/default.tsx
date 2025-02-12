export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-dvh w-screen overflow-clip">
        {children}
    </div>
  );
}
