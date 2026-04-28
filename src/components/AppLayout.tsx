import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout wrapper for authenticated pages.
 * Provides the navbar + page container spacing.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <Navbar />
      <main className="pt-16">
        <div className="page-container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}