"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Brain,
  BookOpenCheck,
  NotebookPen,
  Calendar,
  Activity,
} from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/analyze",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedState = res.data.mentalstate;
      if (updatedState) {
        setUser((prev) => ({ ...prev, mentalstate: updatedState }));
        setHasPredicted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load user data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Blogs",
      value: user.totalBlogs || 0,
      icon: BookOpenCheck,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Journals Written",
      value: user.totalJournals || 0,
      icon: NotebookPen,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Mental Health",
      value: user.mentalstate || "Unknown",
      icon: Brain,
      bgColor: user.mentalstate === "positive" ? "bg-green-100" : "bg-red-100",
      textColor:
        user.mentalstate === "positive" ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back,{" "}
              <span className="text-purple-600">{user.firstName}!</span>
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your mental wellness journey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>
              <p className={`text-2xl font-bold ${stat.textColor} capitalize`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Mental Health Analysis
            </h3>
            <Activity size={20} className="text-purple-600" />
          </div>
          <p className="text-gray-600 mb-4">
            Get AI-powered insights about your current mental state based on
            your recent activities.
          </p>

          {/* ✅ Your connected button */}
          <button
            onClick={handleAnalyze}
            disabled={hasPredicted || isAnalyzing}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              hasPredicted || isAnalyzing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {hasPredicted
              ? "Analysis Complete"
              : isAnalyzing
              ? "Analyzing..."
              : "Analyze Mental State"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
