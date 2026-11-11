import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
