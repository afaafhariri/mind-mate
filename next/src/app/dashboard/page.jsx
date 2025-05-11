"use client";
import NavBar from "@components/nav-bar";
import Header from "@components/header";
import Footer from "@components/footer";
import Chatbot from "@components/chat-bot";
import UserRouteProtection from "@components/user-route";
import { useEffect, useState } from "react";
import axios from "axios";

import { Brain } from "lucide-react";
import { BookOpenCheck } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { MessageSquare } from "lucide-react";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [hasPredicted, setHasPredicted] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <UserRouteProtection>
      <div className="flex min-h-screen">
        <NavBar />
        <div className="flex flex-col ml-20 w-full">
          <Header />
          <main className="flex-grow px-8 py-8">
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-xl shadow-md p-6 max-w-full">
              <div className="top-6 right-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-lg font-medium text-purple-700">
                  Hey, <b>{user.firstName}!</b>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Blogs Stats */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-4">
                    <BookOpenCheck size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Total Blogs</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {user.totalBlogs}
                  </p>
                </div>

                {/* Journals Stats */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <NotebookPen size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Journals Written
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {user.totalJournals}
                  </p>
                </div>

                {/* Comments Stats */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mb-4">
                    <MessageSquare size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Comments Made</h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {user.totalComments}
                  </p>
                </div>

                {/* Mental Health State */}
                <div className="bg-white rounded-lg shadow p-5 flex flex-col items-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <Brain size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Mental Health</h3>
                  <p
                    className={`text-3xl font-bold ${
                      user.mentalstate === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.mentalstate}
                  </p>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => {
                    if (!hasPredicted) {
                      setUser((prevUser) => ({
                        ...prevUser,
                        mentalstate:
                          prevUser.mentalstate === "positive"
                            ? "negative"
                            : "positive",
                      }));
                      setHasPredicted(true);
                    }
                  }}
                  disabled={hasPredicted}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    hasPredicted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Predict
                </button>
              </div>
              <Chatbot />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </UserRouteProtection>
  );
}

export default DashboardPage;
