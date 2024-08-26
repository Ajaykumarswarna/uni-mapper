import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MarkdownEditor from "./components/MarkdownEditor";
import FlowchartCreation from "./components/FlowchartCreation";
import CreateNotePage from "./pages/CreateNotePage";
import NoteDetail from "./pages/NoteDetail";
import { ToastContainer } from "react-toastify";



function App() {
  return (
    <>
    <div className="pb-24">
      <Navbar />
    </div>
        <ToastContainer/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/notes" element={<MarkdownEditor />} />
        <Route path="/note/:id" element={<NoteDetail />} />
        <Route path="/create-note" element={<CreateNotePage />} />
        <Route path="/flowchart-creation" element={<FlowchartCreation />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
 
      </Routes>
   
    </>
  );
}

export default App;
