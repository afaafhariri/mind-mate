"use client";
import NavBar from "@components/nav-bar";
import Chatbot from "@components/chat-bot";
import UserRouteProtection from "@components/user-route";
import Dashboard from "@components/dashboard";

function DashboardPage() {
  return (
    <UserRouteProtection>
      <div className="flex min-h-screen bg-gray-50">
        <NavBar currentPage="dashboard" />
        <div className="flex-1 ml-20 transition-all duration-300">
          <main className="flex items-center justify-center min-h-screen">
            <Dashboard />
          </main>
        </div>
        <Chatbot />
      </div>
    </UserRouteProtection>
  );
}

export default DashboardPage;
