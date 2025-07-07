"use client";
import NavBar from "@components/nav-bar";
import Header from "@components/header";
import Footer from "@components/footer";
import UserRouteProtection from "@components/user-route";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Mic, Square, X } from "lucide-react";

function JournalsPage() {
  const [journals, setJournals] = useState([]);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [journalToDelete, setJournalToDelete] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const fetchJournals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/journals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(res.data);
    } catch (err) {
      console.error("Error fetching journals", err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const sortJournals = (list, order) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

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
      // Only show an alert for actual unexpected errors
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
      recognition.onresult = null; // block result from being applied
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
      fetchJournals();
    } catch (err) {
      console.error("Error saving journal", err);
    }
  };

  const handleEdit = (journal) => {
    setEditingId(journal.id);
    setTopic(journal.topic);
    setBody(journal.body);
    setLocation(journal.location || "");
    setErrors({});
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

  return (
    <UserRouteProtection>
      <div className="flex min-h-screen">
        <NavBar />
        <div className="flex flex-col ml-20 w-full">
          <Header />
          {journalToDelete && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">
                  Are you sure you want to delete "
                  <b>{journalToDelete.topic}</b>"?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setJournalToDelete(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleDelete(journalToDelete.id);
                      setJournalToDelete(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          <main className="flex-grow px-8 py-8">
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-xl shadow-md p-6 max-w-full">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Journals</h1>
              </div>

              {/* Journal Form */}
              <form
                onSubmit={handleSubmit}
                className="mb-8 bg-white p-4 rounded-lg shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      className="border p-2 rounded w-full"
                      placeholder="Topic *"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    {errors.topic && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.topic}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      className="border p-2 rounded w-full"
                      placeholder="Location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium mb-1">
                      Body *
                    </label>
                    <textarea
                      className="border p-2 rounded w-full"
                      placeholder="Speak or type your journal..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                    />
                    {errors.body && (
                      <p className="text-red-600 text-sm mt-1">{errors.body}</p>
                    )}

                    <div className="flex gap-4 mt-2">
                      {!isRecording && (
                        <button
                          type="button"
                          onClick={startVoiceInput}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-2"
                        >
                          <Mic size={16} />
                          Start Voice
                        </button>
                      )}
                      {isRecording && (
                        <>
                          <button
                            type="button"
                            onClick={stopVoiceInput}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Square size={16} />
                            Stop
                          </button>
                          <button
                            type="button"
                            onClick={cancelVoiceInput}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                    {isRecording && (
                      <p className="text-blue-600 text-sm mt-1">Listening...</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingId ? "Update" : "Create"} Journal
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setTopic("");
                        setBody("");
                        setLocation("");
                        setErrors({});
                      }}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
              <div className="flex justify-end mb-4">
                <button
                  onClick={generatePDF}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
                >
                  <FileText size={18} />
                  Download PDF
                </button>
              </div>
              {/* Journal List */}
              <div className="grid gap-4">
                {journals.map((journal) => (
                  <div key={journal.id} className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{journal.topic}</h2>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleEdit(journal)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => setJournalToDelete(journal)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(journal.createdAt).toLocaleString()}
                    </div>
                    {journal.location && (
                      <p className="text-gray-600 italic">
                        Location: {journal.location}
                      </p>
                    )}
                    <p className="mt-2">{journal.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </UserRouteProtection>
  );
}

export default JournalsPage;
