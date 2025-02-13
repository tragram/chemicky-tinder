export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
    <div className="absolute w-screen h-screen background"></div>
    <div className="relative flex flex-col h-dvh w-screen overflow-clip">
        {children}
    </div>
      </>
  );
}
