"use client";
import NavBar from "@components/nav-bar";
import Header from "@components/header";
import Footer from "@components/footer";
import Chatbot from "@components/chat-bot";
import UserRouteProtection from "@components/user-route";
import Dashboard from "@components/dashboard";

function DashboardPage() {
  return (
    <UserRouteProtection>
      <div className="flex min-h-screen bg-gray-50">
        <NavBar currentPage="dashboard" />

        <div className="flex-1 ml-20 transition-all duration-300">
          <Header />

          <main className="flex-grow">
            <Dashboard />
          </main>

          <Footer />
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
    </UserRouteProtection>
  );
}

export default DashboardPage;
