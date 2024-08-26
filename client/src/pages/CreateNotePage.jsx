import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DAta";

const CreateNotePage = () => {
  const [newNote, setNewNote] = useState({ name: "", description: "", content: "", flowchart_id: null, user_id:"" });
  const [error, setError] = useState(null);
  const [flowchartImage, setFlowchartImage] = useState(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { data } = useData();
  const token = data.token;

  const location = useLocation();
  const flowchartId = location.state?.flowchartId;


  useEffect(() => {
    const savedNote = JSON.parse(sessionStorage.getItem("newNote"));
    if (savedNote) {
      setNewNote(savedNote);
    }
  }, []);


  useEffect(() => {
    if (flowchartId) {
      const fetchFlowchartImage = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/flowcharts/${flowchartId}`, {
            headers: {
              Authorization: token
            },
          });

          if (response.data?.image_path) {
            setFlowchartImage(`http://localhost:5000${response.data.image_path}`);
            setNewNote(prevNote => ({
              ...prevNote,
              flowchart_id: flowchartId 
            }));
          } else {
            setError("No image path found.");
          }
        } catch (error) {
          console.error("Failed to fetch flowchart image:", error);
          setError("Failed to load flowchart image.");
        }
      };
      fetchFlowchartImage();
    }
  }, [flowchartId, token]);

  const handleAttachFlowchart = () => {
    sessionStorage.setItem("newNote", JSON.stringify(newNote));
    navigate('/flowchart-creation');
  };

  const handleSaveNewNote = async () => {
    if (!newNote.name.trim()) {
      setError("Name field is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/notes/", newNote, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
      });

      console.log("Note created successfully:", response.data);
      

      sessionStorage.removeItem("newNote");
      navigate('/notes');
    } catch (error) {
      console.error("Failed to create note:", error);
      setError("Failed to create note. Please try again.");
    }
  };

  const buttonStyle = theme === "dark"
    ? "bg-blue-600 text-white"
    : theme === "solarized"
    ? "bg-yellow-600 text-black"
    : theme === "high-contrast"
    ? "bg-[#ffcc00] text-white"
    : "bg-blue-400 text-white";

  return (
    <div className="container max-w-6xl min-h-screen h-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Note</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="note-name" className="block font-semibold">Name:</label>
          <input
            type="text"
            id="note-name"
            value={newNote.name}
            onChange={(e) => setNewNote({ ...newNote, name: e.target.value })}
            className="w-full p-2 border text-black rounded-md"
          />
        </div>
        <div>
          <label htmlFor="note-description" className="block font-semibold">Description:</label>
          <input
            type="text"
            id="note-description"
            value={newNote.description}
            onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
            className="w-full p-2 border text-black rounded-md"
          />
        </div>
        <div>
          <label htmlFor="note-content" className="block font-semibold">Content:</label>
          <textarea
            id="note-content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-2 border text-black rounded-md h-32"
          />
        </div>
        <div>
          <label htmlFor="note-flowchart" className="block font-semibold">Attached Flowchart:</label>
          {flowchartImage ? (
            <img src={flowchartImage} alt="Flowchart" className="w-full h-64 object-contain" />
          ) : (
            <button
              type="button"
              onClick={handleAttachFlowchart}
              className={`px-4 py-2 rounded-md text-white ${buttonStyle}`}
            >
              Attach Flowchart
            </button>
          )}
        </div>
      </form>
      <div className="mt-4">
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleSaveNewNote}
          className={`px-4 py-2 text-white rounded-md ${buttonStyle}`}
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default CreateNotePage;
