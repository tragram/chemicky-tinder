export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
    <div className="absolute h-dvh w-dvw background"></div>
    <div className="relative flex flex-col h-dvh w-dvw overflow-clip">
        {children}
    </div>
      </>
  );
}
