import { Toaster } from "@/shared/ui/sonner";
import { Outlet, ScrollRestoration } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
      <ScrollRestoration />
    </>
  );
}

export default RootLayout;
