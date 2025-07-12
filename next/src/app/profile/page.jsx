"use client";

import UserRouteProtection from "@components/user-route";
import NavBar from "@components/nav-bar";
import Header from "@components/header";
import Footer from "@components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  User,
  Mail,
  Globe,
  Briefcase,
  Calendar,
  MapPin,
  UserCircle,
} from "lucide-react";

// Helper to calculate "Joined X ago"
function formatJoinedAgo(dateString) {
  const createdAt = new Date(dateString);
  const now = new Date();
  const diffMs = now - createdAt;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffWeeks > 0)
    return `Joined ${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffDays > 0)
    return `Joined ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0)
    return `Joined ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0)
    return `Joined ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Joined just now";
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserRouteProtection>
      <div className="flex min-h-screen">
        <NavBar currentPage="profile" />
        <div className="flex flex-col ml-20 w-full">
          <Header />
          <main className="flex-grow px-8 py-12 flex justify-center items-start">
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 w-full max-w-xl">
              <div className="flex items-center mb-6">
                <UserCircle className="w-8 h-8 text-purple-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              </div>

              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : user ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Full Name
                    </h2>
                    <p className="text-lg font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> Email
                    </h2>
                    <p className="text-lg font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>

                  {(user.city || user.country) && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Location
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {user.city ? `${user.city}, ` : ""}
                        {user.country || ""}
                      </p>
                    </div>
                  )}

                  {user.age && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" /> Age
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {user.age} years old
                      </p>
                    </div>
                  )}

                  {user.gender && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" /> Gender
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {user.gender}
                      </p>
                    </div>
                  )}

                  {user.occupation && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> Occupation
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {user.occupation}
                      </p>
                    </div>
                  )}

                  {user.createdAt && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Account Created
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {formatJoinedAgo(user.createdAt)}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full mt-6 px-4 py-3 border border-purple-500 text-purple-500 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Couldn’t load your profile.
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </UserRouteProtection>
  );
}
