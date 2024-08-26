import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DAta";

const NoteDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialNote = location.state; 

  const { theme } = useContext(ThemeContext); 


  const [note, setNote] = useState(initialNote);
  const [originalNote, setOriginalNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const [flowchartImage, setFlowchartImage] = useState(null); 
  const [isLoadingImage, setIsLoadingImage] = useState(true); 


  const descriptionRef = useRef(null);
  const contentRef = useRef(null);

  const { data } = useData();
  const token = data.token;


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDiscardChanges = () => {
    setNote(originalNote);
    setIsEditing(false);
  };


  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/notes/${note.id}`,
        note,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );


      setOriginalNote(response.data);
      setIsEditing(false);
      navigate("/notes"); 
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote({
      ...note,
      [name]: value,
    });
    adjustTextareaHeight(e.target);
  };


  const adjustTextareaHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const fetchFlowchartImage = async () => {
      if (note.flowchart_id) {
        setIsLoadingImage(true); 
        try {
          const response = await axios.get(`http://localhost:5000/flowcharts/${note.flowchart_id}`, {
            headers: {
              Authorization: token
            },
          });

          if (response.data?.image_path) {
            setFlowchartImage(`http://localhost:5000${response.data.image_path}`);
          } else {
            setFlowchartImage(null);
          }
        } catch (error) {
          console.error("Failed to fetch flowchart image:", error);
          setFlowchartImage(null);
        } finally {
          setIsLoadingImage(false); 
        }
      } else {
        setIsLoadingImage(false); 
      }
    };
    fetchFlowchartImage();
  }, [note.flowchart_id, token]);

  useEffect(() => {
    adjustTextareaHeight(descriptionRef);
    adjustTextareaHeight(contentRef);
  }, [note.description, note.content]);

  
  const buttonColor =
    theme === "dark"
      ? "bg-blue-600"
      : theme === "solarized"
      ? "bg-yellow-600"
      : theme === "high-contrast"
      ? "bg-white text-black"
      : "bg-blue-400";

  return (
    <div className="p-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl font-bold capitalize mb-4">{note.name || "Untitled Note"}</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleDiscardChanges}
              className="px-4 py-2 bg-gray-600 w-fit  rounded-md"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSaveChanges}
              className={`px-4 py-2 ${buttonColor} w-fit  rounded-md`}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditClick}
            className={`px-4 py-2 ${buttonColor} w-fit  rounded-md`}
          >
            Edit
          </button>
        )}
      </div>
      <p className="mb-4 pt-16">
        {isEditing ? (
          <textarea
            ref={descriptionRef}
            name="description"
            value={note.description}
            onChange={handleInputChange}
            className="w-full p-2 bg-transparent outline-none resize-none rounded min-h-[100px]"
          />
        ) : (
          note.description
        )}
      </p>
      <div>
        {isEditing ? (
          <textarea
            ref={contentRef}
            name="content"
            value={note.content}
            onChange={handleInputChange}
            className="w-full p-2 bg-transparent outline-none resize-none rounded min-h-[200px]"
          />
        ) : (
          note.content
        )}
      </div>
      {isLoadingImage ? (
        <div className="mt-8 text-center">
          <p>Loading flowchart...</p>
        </div>
      ) : flowchartImage ? (
        <div className="mt-8">
          <h4 className="font-semibold mt-4">Attached Flowchart:</h4>
          <img src={flowchartImage} alt="Flowchart" className="w-full h-[600px] object-contain mt-4" />
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p>No flowchart available.</p>
        </div>
      )}
    </div>
  );
};

export default NoteDetail;
