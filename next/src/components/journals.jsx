"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  MicIcon,
  StopCircle,
} from "lucide-react";

function Journals() {
  const [journals, setJournals] = useState([]);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [journalToDelete, setJournalToDelete] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching journals", err);
      setIsLoading(false);
    }
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

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text("My Journal Entries", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Exported on: ${date}`, 14, 30);

    const tableColumn = ["#", "Topic", "Location", "Created At", "Body"];
    const tableRows = journals.map((journal, index) => [
      index + 1,
      journal.topic,
      journal.location || "N/A",
      new Date(journal.createdAt).toLocaleString(),
      journal.body,
    ]);

    autoTable(doc, {
      startY: 36,
      head: [tableColumn],
      body: tableRows,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "top",
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save("my-journals.pdf");
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.lang = "en-US";
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => setIsRecording(true);
    recognizer.onend = () => {
      setIsRecording(false);
      setRecognition(null);
    };

    recognizer.onresult = (event) => {
      const transcript = event.results[0][0]?.transcript?.trim();
      if (transcript) {
        setBody((prev) => prev + " " + transcript);
      }
    };

    recognizer.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (
        event.error !== "no-speech" &&
        event.error !== "aborted" &&
        event.error !== "not-allowed"
      ) {
        alert("Speech recognition failed.");
      }
      setIsRecording(false);
      setRecognition(null);
    };

    recognizer.start();
    setRecognition(recognizer);
  };

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
  };

  const cancelVoiceInput = () => {
    if (recognition) {
      recognition.onresult = null;
      recognition.stop();
      setRecognition(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const token = localStorage.getItem("token");

    try {
      if (editingId) {
        await axios.put(
          `/api/journals/${editingId}`,
          { topic, body, location },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "/api/journals",
          { topic, body, location },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setTopic("");
      setBody("");
      setLocation("");
      setEditingId(null);
      setShowForm(false);
      fetchJournals();
    } catch (err) {
      console.error("Error saving journal", err);
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJournals();
    } catch (err) {
      console.error("Error deleting journal", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTopic("");
    setBody("");
    setLocation("");
    setErrors({});
    setShowForm(false);
  };

  const filteredJournals = journals.filter(
    (journal) =>
      journal.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (journal.location &&
        journal.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Delete Confirmation Modal */}
      {journalToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete "
              <b className="text-gray-800">{journalToDelete.topic}</b>"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setJournalToDelete(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(journalToDelete._id);
                  setJournalToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Journals
            </h1>
            <p className="text-gray-600">
              Capture your thoughts and experiences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download size={18} />
              Export PDF
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              {showForm ? "Hide Form" : "New Journal"}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Journal Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? "Edit Journal" : "Create New Journal"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.topic ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="What's on your mind?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                {errors.topic && (
                  <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Where are you?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Journal Entry *
              </label>
              <textarea
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.body ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Write your thoughts or use voice input..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
              />
              {errors.body && (
                <p className="text-red-500 text-sm mt-1">{errors.body}</p>
              )}

              {/* Voice Input Controls */}
              <div className="flex items-center gap-2 mt-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MicIcon size={16} />
                    Start Recording
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={stopVoiceInput}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <StopCircle size={16} />
                      Stop
                    </button>
                    <button
                      type="button"
                      onClick={cancelVoiceInput}
                      className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <span className="text-sm text-blue-600 animate-pulse">
                      🎤 Listening...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update" : "Create"} Journal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journals List */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No journals found" : "No journals yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start writing your first journal entry"}
            </p>
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div
              key={journal._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {journal.topic}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </div>
                    {journal.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {journal.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(journal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit journal"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setJournalToDelete(journal)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete journal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{journal.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Journals;
