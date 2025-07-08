"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  BookOpen,
  Sparkles,
  Mic,
  StopCircle,
  X,
  Plus,
  Sun,
  Moon,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Calendar,
  Edit3,
  Quote,
  Volume2,
  Save,
  XCircle,
  Heart,
  Star,
  Zap,
} from "lucide-react";

export default function Journals() {
  const [journals, setJournals] = useState([
    {
      _id: "1",
      topic: "Morning Reflections",
      body: "Today I woke up feeling grateful for the small moments in life. The sunrise was particularly beautiful, casting a golden glow across my room. I've been thinking about how important it is to appreciate these quiet moments of peace.",
      location: "Home",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      topic: "Adventure Day",
      body: "Went hiking in the mountains today. The fresh air and stunning views reminded me why I love being in nature. Met some fellow hikers who shared interesting stories about their travels.",
      location: "Blue Ridge Mountains",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
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
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Mock functions for demo (replace with actual API calls)
  const fetchJournals = async () => {
    // This would normally fetch from your API
    console.log("Fetching journals...");
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!topic.trim()) newErrors.topic = "Topic is required";
    if (!body.trim()) newErrors.body = "Body is required";
    if (location.trim() && /^[0-9]+$/.test(location.trim())) {
      newErrors.location = "Location cannot be only numbers";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      if (editingId) {
        // Update existing journal
        setJournals((prev) =>
          prev.map((j) =>
            j._id === editingId ? { ...j, topic, body, location } : j
          )
        );
      } else {
        // Create new journal
        const newJournal = {
          _id: Date.now().toString(),
          topic,
          body,
          location,
          createdAt: new Date().toISOString(),
        };
        setJournals((prev) => [newJournal, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error("Error saving journal", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      setJournals((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Error deleting journal", err);
    }
  };

  const handleEdit = (journal) => {
    setEditingId(journal._id);
    setTopic(journal.topic);
    setBody(journal.body);
    setLocation(journal.location || "");
    setErrors({});
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTopic("");
    setBody("");
    setLocation("");
    setErrors({});
    setShowForm(false);
    setTranscript("");
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const startVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech Recognition not supported in this browser. Please try Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer = new SpeechRecognition();

    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en-US";
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => {
      setIsRecording(true);
      setIsListening(true);
      setTranscript("");
    };

    recognizer.onend = () => {
      setIsRecording(false);
      setIsListening(false);
      setRecognition(null);
    };

    recognizer.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setIsListening(false);
      setRecognition(null);

      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. Please allow microphone access and try again."
        );
      } else {
        alert("Speech recognition error: " + event.error);
      }
    };

    recognizer.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript);

      if (finalTranscript) {
        setBody((prev) => prev + (prev ? " " : "") + finalTranscript);
        setTranscript("");
      }
    };

    recognizer.start();
    setRecognition(recognizer);
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
    }
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

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white"
          : "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
              <BookOpen className="h-12 w-12 text-purple-600" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div>
              <h1
                className={`text-4xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                My Journals
              </h1>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Capture your thoughts and memories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-white hover:bg-gray-50 text-gray-600 shadow-lg"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                showForm ? "ring-2 ring-purple-300" : ""
              }`}
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Close Form" : "New Journal"}
            </button>
          </div>
        </div>

        {/* Enhanced Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search your thoughts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <Filter size={18} />
            Filters
            <ChevronDown
              size={16}
              className={`${
                showFilters ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
          </button>
        </div>

        {/* Enhanced Filters */}
        {showFilters && (
          <div
            className={`mb-8 p-6 rounded-xl transition-all duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white shadow-lg"
            }`}
          >
            <div className="flex items-center gap-4">
              <label className="font-semibold">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Enhanced Journal Form */}
        {showForm && (
          <div
            className={`mb-8 p-8 rounded-2xl shadow-2xl transition-all duration-500 transform ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Edit3 className="text-purple-600" size={24} />
                {editingId ? "Edit Journal" : "New Journal"}
              </h2>
              <button
                onClick={resetForm}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-600">
                  Topic
                </label>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`w-full p-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200"
                  } ${errors.topic ? "ring-2 ring-red-500" : ""}`}
                />
                {errors.topic && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <XCircle size={16} /> {errors.topic}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-600">
                  Your Thoughts
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Share your thoughts, feelings, or experiences..."
                    value={body + (transcript ? " " + transcript : "")}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className={`w-full p-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] resize-none ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200"
                    } ${errors.body ? "ring-2 ring-red-500" : ""}`}
                  />
                  {isListening && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-500 font-medium">
                        Listening...
                      </span>
                    </div>
                  )}
                </div>
                {errors.body && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <XCircle size={16} /> {errors.body}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-purple-600">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Where are you writing from? (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full p-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200"
                  } ${errors.location ? "ring-2 ring-red-500" : ""}`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <XCircle size={16} /> {errors.location}
                  </p>
                )}
              </div>

              {/* Enhanced Voice Input */}
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-purple-600">
                  Voice Input:
                </div>
                {!isRecording ? (
                  <button
                    onClick={startVoiceInput}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Mic size={16} />
                    Start Recording
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={stopVoiceInput}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <StopCircle size={16} />
                      Stop Recording
                    </button>
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg">
                      <Volume2 size={16} className="animate-pulse" />
                      <span className="text-sm">Recording...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Save size={18} />
                  {editingId ? "Update Journal" : "Create Journal"}
                </button>
                <button
                  onClick={resetForm}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Journal Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJournals.map((journal, index) => (
            <div
              key={journal._id}
              className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-100 hover:bg-gray-50"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-bold line-clamp-1">
                    {journal.topic}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(journal)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      darkMode
                        ? "text-blue-400 hover:bg-blue-900/20"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setJournalToDelete(journal)}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                      darkMode
                        ? "text-red-400 hover:bg-red-900/20"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center gap-4 text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(journal.createdAt).toLocaleDateString()}
                </div>
                {journal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="truncate">{journal.location}</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <Quote
                  className={`absolute -top-2 -left-2 w-6 h-6 ${
                    darkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p
                  className={`text-sm leading-relaxed line-clamp-4 pl-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {journal.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredJournals.length === 0 && (
          <div className="text-center py-16">
            <BookOpen
              className={`mx-auto h-16 w-16 mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              No journals found
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start writing your first journal entry!"}
            </p>
          </div>
        )}

        {/* Enhanced Delete Modal */}
        {journalToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`p-8 rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300 ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Delete Journal?</h2>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Are you sure you want to delete "{journalToDelete.topic}"?
                  This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setJournalToDelete(null)}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleDelete(journalToDelete._id);
                      setJournalToDelete(null);
                    }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
