const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-dvw h-dvh bg-gray-100">
      <div className="h-full mx-auto flex max-w-sm items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
