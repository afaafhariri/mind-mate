"use client";
import { useEffect, useState } from "react";
import {
  FileText,
  Mic,
  Square,
  X,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Plus,
  Download,
  Search,
  Filter,
  BookOpen,
  StopCircle,
  Heart,
  Bookmark,
  Eye,
  Sparkles,
  Moon,
  Sun,
  ChevronDown,
  Quote,
} from "lucide-react";

function Journals() {
  const [journals, setJournals] = useState([
    {
      _id: "1",
      topic: "Morning Reflections",
      body: "Today I woke up feeling grateful for the small things in life. The sunlight streaming through my window reminded me of how beautiful simple moments can be. I've been thinking about my goals and how I want to approach this new week with intention and mindfulness.",
      location: "San Francisco, CA",
      createdAt: "2024-01-15T08:30:00Z",
    },
    {
      _id: "2",
      topic: "Learning React",
      body: "Spent the day diving deep into React hooks and state management. It's fascinating how much you can accomplish with just a few lines of code. I'm starting to see patterns in how components interact with each other.",
      location: "Coffee Shop Downtown",
      createdAt: "2024-01-14T14:20:00Z",
    },
    {
      _id: "3",
      topic: "Weekend Adventures",
      body: "Went hiking in the mountains today. The fresh air and stunning views reminded me why I love being in nature. Met some interesting people on the trail and had great conversations about life and dreams.",
      location: "Blue Ridge Mountains",
      createdAt: "2024-01-13T16:45:00Z",
    },
  ]);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [journalToDelete, setJournalToDelete] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!topic.trim()) newErrors.topic = "Topic is required";
    if (!body.trim()) newErrors.body = "Body is required";
    if (location.trim() && /^[0-9]+$/.test(location.trim())) {
      newErrors.location = "Location cannot be only numbers";
    }
    return newErrors;
  };

  const generatePDF = () => {
    alert("PDF generation would work with jsPDF in a real implementation");
  };

  const startVoiceInput = () => {
    setIsRecording(true);
    // Simulate voice input for demo
    setTimeout(() => {
      setBody((prev) => prev + " This is simulated voice input text.");
      setIsRecording(false);
    }, 3000);
  };

  const stopVoiceInput = () => {
    setIsRecording(false);
  };

  const cancelVoiceInput = () => {
    setIsRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const newJournal = {
      _id: Date.now().toString(),
      topic,
      body,
      location,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      setJournals(
        journals.map((j) =>
          j._id === editingId ? { ...j, topic, body, location } : j
        )
      );
    } else {
      setJournals([newJournal, ...journals]);
    }

    setTopic("");
    setBody("");
    setLocation("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (journal) => {
    setEditingId(journal._id);
    setTopic(journal.topic);
    setBody(journal.body);
    setLocation(journal.location || "");
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setJournals(journals.filter((j) => j._id !== id));
  };

  const resetForm = () => {
    setEditingId(null);
    setTopic("");
    setBody("");
    setLocation("");
    setErrors({});
    setShowForm(false);
  };

  const filteredJournals = journals
    .filter(
      (journal) =>
        journal.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (journal.location &&
          journal.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return a.topic.localeCompare(b.topic);
      return 0;
    });

  const theme = darkMode ? "dark" : "light";

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
          : "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Delete Confirmation Modal */}
        {journalToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } p-8 rounded-2xl shadow-2xl max-w-md w-full border transform transition-all duration-300 scale-100`}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Delete Journal Entry?
                </h2>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Are you sure you want to delete "{journalToDelete.topic}"?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setJournalToDelete(null)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleDelete(journalToDelete._id);
                      setJournalToDelete(null);
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur opacity-75"></div>
                <div
                  className={`relative ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-3 rounded-full shadow-lg`}
                >
                  <BookOpen
                    className={`h-8 w-8 ${
                      darkMode ? "text-violet-400" : "text-violet-600"
                    }`}
                  />
                </div>
              </div>
              <div>
                <h1
                  className={`text-5xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  My Journals
                </h1>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Capture your thoughts and experiences ✨
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download size={18} />
                Export PDF
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={18} />
                {showForm ? "Hide Form" : "New Journal"}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search your thoughts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                } shadow-lg hover:shadow-xl`}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-4 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } shadow-lg hover:shadow-xl border-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Filter size={18} />
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div
              className={`mt-4 p-4 rounded-xl transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border-2 shadow-lg`}
            >
              <div className="flex flex-wrap gap-4 items-center">
                <label
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-violet-500`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Journal Form */}
        {showForm && (
          <div
            className={`mb-8 rounded-2xl shadow-2xl border-2 p-8 transition-all duration-300 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles
                className={`h-6 w-6 ${
                  darkMode ? "text-violet-400" : "text-violet-600"
                }`}
              />
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {editingId ? "Edit Journal Entry" : "Create New Journal Entry"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Topic *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ${
                      errors.topic
                        ? "border-red-500"
                        : darkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white"
                    } shadow-lg hover:shadow-xl`}
                    placeholder="What's on your mind?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  {errors.topic && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.topic}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`block text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Location (optional)
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ${
                        errors.location
                          ? "border-red-500"
                          : darkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white"
                      } shadow-lg hover:shadow-xl`}
                      placeholder="Where are you?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className={`block text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Journal Entry *
                </label>
                <textarea
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 ${
                    errors.body
                      ? "border-red-500"
                      : darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white"
                  } shadow-lg hover:shadow-xl`}
                  placeholder="Write your thoughts or use voice input..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                />
                {errors.body && (
                  <p className="text-red-500 text-sm font-medium">
                    {errors.body}
                  </p>
                )}

                {/* Voice Input Controls */}
                <div className="flex items-center gap-3 pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Mic size={16} />
                      Start Recording
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={stopVoiceInput}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <StopCircle size={16} />
                        Stop
                      </button>
                      <button
                        type="button"
                        onClick={cancelVoiceInput}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <span className="text-sm text-emerald-600 animate-pulse font-medium flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        Listening...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {editingId ? "Update" : "Create"} Journal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journals List */}
        <div className="space-y-6">
          {filteredJournals.length === 0 ? (
            <div
              className={`text-center py-16 rounded-2xl shadow-lg border-2 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur opacity-75"></div>
                <div
                  className={`relative ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } p-4 rounded-full`}
                >
                  <BookOpen
                    className={`h-16 w-16 ${
                      darkMode ? "text-violet-400" : "text-violet-600"
                    }`}
                  />
                </div>
              </div>
              <h3
                className={`text-xl font-bold mt-6 mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {searchTerm ? "No journals found" : "No journals yet"}
              </h3>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Start writing your first journal entry"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJournals.map((journal, index) => (
                <div
                  key={journal._id}
                  className={`rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 hover:border-violet-500"
                      : "bg-white border-gray-200 hover:border-violet-300"
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Quote
                          className={`h-5 w-5 ${
                            darkMode ? "text-violet-400" : "text-violet-600"
                          }`}
                        />
                        <h3
                          className={`text-xl font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {journal.topic}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span className="font-medium">
                            {new Date(journal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {journal.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="font-medium">
                              {journal.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(journal)}
                        className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                          darkMode
                            ? "text-blue-400 hover:bg-blue-500/20"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Edit journal"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setJournalToDelete(journal)}
                        className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                          darkMode
                            ? "text-red-400 hover:bg-red-500/20"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete journal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-violet-600 to-purple-600 rounded-full`}
                    ></div>
                    <div className="pl-4">
                      <p
                        className={`leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {journal.body}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 bg-green-500 rounded-full ${
                          darkMode ? "opacity-80" : ""
                        }`}
                      ></div>
                      <span
                        className={`text-xs font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {journal.body.split(" ").length} words
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`p-1 rounded transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:text-red-400"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Heart size={14} />
                      </button>
                      <button
                        className={`p-1 rounded transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:text-yellow-400"
                            : "text-gray-500 hover:text-yellow-500"
                        }`}
                      >
                        <Bookmark size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Journals;
