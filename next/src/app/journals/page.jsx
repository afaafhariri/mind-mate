"use client";
import NavBar from "@components/nav-bar";
import Header from "@components/header";
import Footer from "@components/footer";
import UserRouteProtection from "@components/user-route";
import Journals from "@components/journals";

function JournalsPage() {
  return (
    <UserRouteProtection>
      <div className="flex min-h-screen bg-gray-50">
        <NavBar currentPage="journals" />

        {/* Main Content Area */}
        <div className="flex-1 ml-20 transition-all duration-300">
          <Header />

          <main className="flex-grow">
            <Journals />
          </main>

          <Footer />
        </div>
      </div>
    </UserRouteProtection>
  );
}

export default JournalsPage;
