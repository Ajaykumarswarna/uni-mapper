import { useState, useContext, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DAta";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";

const MarkdownEditor = () => {
  const [deleteNotes, setDeleteNotes] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { data } = useData();
  const token = data.token;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/notes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = response.data;
      console.log("Fetched notes:", data);
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("Expected an array but received:", data);
        setNotes([]);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setNotes([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]); 


  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateDescription = (description, wordLimit = 20) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  const handleViewClick = (project) => {
    navigate(`/note/${project.id}`, { state: project });
  };

  const handleDeleteClick = (project) => {
    setDeleteNotes(project);
    document.getElementById("delete_modal").showModal();
  };

  const confirmDelete = async () => {
    if (deleteNotes) {
      const success = await deleteNote(deleteNotes.id, token);
      if (success) {

        setNotes(notes.filter((note) => note.id !== deleteNotes.id));
      }
      setDeleteNotes(null);
      document.getElementById("delete_modal").close();
    }
  };

  const deleteNote = async (noteId, token) => {
    try {
      const response = await axios.delete(`http://localhost:5000/notes/${noteId}`, {
        headers: {
          Authorization: token
        }
      });
  
      if (response.status === 200) {
        console.log('Note deleted successfully');
        return true; 
      } else {
        console.error('Failed to delete the note');
        return false; 
      }
    } catch (error) {
      console.error('An error occurred while deleting the note:', error);
      return false; 
    }
  };

  const cardClass =
    theme === "dark"
      ? "bg-blue-400 text-white"
      : theme === "solarized"
      ? "bg-yellow-600 text-black"
      : theme === "high-contrast"
      ? "bg-black text-white"
      : theme === "light"
      ? "bg-white text-black"
      : theme === "dracula"
      ? "bg-[#282a36] text-[#f8f8f2]"
      : theme === "nord"
      ? "bg-[#2e3440] text-[#eceff4]"
      : theme === "gruvbox"
      ? "bg-[#282828] text-[#ebdbb2]"
      : "bg-blue-400 text-black";

  const buttonClass =
    theme === "dark"
      ? "bg-blue-600"
      : theme === "solarized"
      ? "bg-white"
      : theme === "high-contrast"
      ? "bg-[#ffcc00] text-black"
      : "bg-blue-400";

      const searchbtnclass = 
      theme === "dark"
      ? "bg-blue-600"
      : theme === "solarized"
      ? "bg-yellow-600"
      : theme === "high-contrast"
      ? "bg-[#ffcc00] text-black"
      : "bg-blue-400";

  return (
    <div className="min-h-screen">
      <header className="flex flex-col lg:flex-row justify-center items-center gap-4 p-4 lg:p-12">
        <div className="flex w-full justify-center items-center">
          <div className="flex search-bar rounded-md w-full px-4 max-w-xl">
            <input
              type="text"
              name="q"
              id="query"
              placeholder="Search your notes..."
              className="w-full p-3 rounded-md border-2 border-r-white text-black rounded-r-none border-gray-300 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={`inline-flex items-center gap-2 text-lg font-semibold py-3 px-6 rounded-r-md ${searchbtnclass}`}
            >
              <span>Search</span>
              <span className="hidden md:block">
                <IoSearch />
              </span>
            </button>
          </div>
        </div>
      </header>

      <dialog id="delete_modal" className="modal">
        {deleteNotes && (
          <div
            className={`modal-box w-96 max-w-5xl ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            }`}
          >
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete {deleteNotes.title}?
            </p>
            <div className="modal-action">
              <button
                onClick={confirmDelete}
                className={`btn ${
                  theme === "dark"
                    ? "bg-red-700 hover:bg-red-800"
                    : theme === "solarized"
                    ? "bg-red-600 hover:bg-red-700"
                    : theme === "high-contrast"
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-red-400 hover:bg-red-500"
                }`}
              >
                Delete
              </button>
              <form method="dialog">
                <button
                  className={`btn ${
                    theme === "dark"
                      ? "bg-blue-700 hover:bg-blue-800"
                      : theme === "solarized"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : theme === "high-contrast"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-blue-400 hover:bg-blue-500"
                  }`}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </dialog>

      <div className="pt-12 p-4 mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 px-12 justify-items-center">
        {loading ? (
          <p className="text-center text-xl">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-xl">No notes found.</p>
        ) : (
          filteredNotes.map((project) => (
            <div
              key={project.id}
              className={`rounded-2xl w-80 flex justify-center items-center flex-col gap-4 text-left shadow-xl p-4 border ${cardClass}`}
            >
              <h1 className={`text-2xl ${cardClass} capitalize font-bold text-left`}>{project.name}</h1>
              <p className="text-center">
                {truncateDescription(project.description)}
              </p>
              <div className="flex w-full justify-center items-center gap-4">
                <button
                  onClick={() => handleViewClick(project)}
                  className={` px-4 w-fit ${buttonClass} py-2 rounded-lg text-gray-900`}
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteClick(project)}
                  className={` px-4 w-fit ${buttonClass} py-2 rounded-lg  text-gray-900`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <div className="flex w-full justify-center items-center mt-4">
          <Link to={"/create-note"} className={`h-16 cursor-pointer w-16 text-3xl flex justify-center ${buttonClass} items-center rounded-full fixed right-4 bottom-4`}>
            <CiCirclePlus />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
