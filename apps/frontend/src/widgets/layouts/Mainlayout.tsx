import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/shared/ui/app-sidebar";
import { SiteHeader } from "@/shared/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
