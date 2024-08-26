/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DAta";


export default function FlowchartCreation() {


  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeLabel, setNodeLabel] = useState("");
  const [flowchartTitle, setFlowchartTitle] = useState("");
  const reactFlowWrapper = useRef(null);

  const [selectedShape, setSelectedShape] = useState("rectangle");

  const handleShapeChange = (event) => {
    setSelectedShape(event.target.value);
  };
  

  const [history, setHistory] = useState({ undo: [], redo: [] });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeLabel(node.data.label);
  }, []);

  const handleLabelChange = (event) => {
    const newLabel = event.target.value;
    setNodeLabel(newLabel);

    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode?.id
          ? { ...n, data: { ...n.data, label: newLabel } }
          : n
      )
    );
  };

  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      data: { label: `Node ${nodes.length + 1}` },
      style: getNodeStyle(selectedShape),
    };
  
    setHistory((hist) => ({
      undo: [...hist.undo, { nodes, edges }],
      redo: [],
    }));
    setNodes((nds) => [...nds, newNode]);
  };
  
  const getNodeStyle = (shape) => {
    const commonStyles = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#000", // Text color
      textAlign: "center", // Ensure text is centered in small shapes
      fontSize: "14px", // Adjust font size as needed
    };
  
    switch (shape) {
      case "rectangle":
        return { ...commonStyles, width: 100, height: 60, borderRadius: 5 };
      case "circle":
        return { ...commonStyles, width: 100, height: 100, borderRadius: "50%" };
      case "square":
        return { ...commonStyles, width: 100, height: 100 };
      case "ellipse":
        return { ...commonStyles, width: 150, height: 75, borderRadius: "50% / 50%" };
        case "cylinder":
          return {
            ...commonStyles,
            width: 100,
            height: 70,
            borderRadius: "50px / 25px", // Creates a cylinder shape
            backgroundColor: "#ffffff", // Cylinder color
            border: "2px solid #000000", // Optional: border for the cylinder
          };
      default:
        return { ...commonStyles, width: 100, height: 60, borderRadius: 5 };
    }
  };
  
  
  

  const deleteNode = () => {
    if (selectedNode) {
      const updatedNodes = nodes.filter((node) => node.id !== selectedNode.id);
      const updatedEdges = edges.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      );
      setHistory((hist) => ({
        undo: [...hist.undo, { nodes, edges }],
        redo: [],
      }));
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setSelectedNode(null);
      setNodeLabel("");
    }
  };

  const undo = () => {
    const { undo, redo } = history;
    if (undo.length === 0) return;

    const lastState = undo[undo.length - 1];
    setHistory({
      undo: undo.slice(0, -1),
      redo: [{ nodes, edges }, ...redo],
    });
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
  };

  const redo = () => {
    const { redo } = history;
    if (redo.length === 0) return;

    const nextState = redo[0];
    setHistory({
      undo: [...history.undo, { nodes, edges }],
      redo: redo.slice(1),
    });
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        redo();
      } else if (event.key === "Delete") {
        event.preventDefault();
        deleteNode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [nodes, edges, history, undo, redo, deleteNode]);



const navigate = useNavigate();

const { data } = useData();
const token = data.token;

const saveAsImage = async () => {
  if (reactFlowWrapper.current) {
    try {
      const dataUrl = await toPng(reactFlowWrapper.current);
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, `${flowchartTitle || "flowchart"}.png`);
      formData.append("title", flowchartTitle);

      const response = await axios.post("http://localhost:5000/flowcharts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token
        },
      });

      if (response) {
        alert("Flowchart image sent successfully!");
        navigate("/create-note", { state: { flowchartId: response.data.flowchart_id } });
      } else {
        throw new Error("Failed to send flowchart image");
      }
    } catch (error) {
      console.error("Error sending flowchart image:", error);

    }
  }
};

  

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <div className="absolute h-fit justify-between right-0 w-72 top-8 min-h-[90%] flex flex-col gap-4 p-4 bg-white">
      <div className="flex gap-2 flex-col">
        <label htmlFor="shape" className="text-black">Select Shape</label>
        <select
  id="shape"
  className="h-10 border"
  value={selectedShape}
  onChange={handleShapeChange}
>
  <option value="rectangle">Rectangle</option>
  <option value="circle">Circle</option>
  <option value="square">Square</option>
  <option value="cylinder">Cylinder</option>
  <option value="ellipse">Ellipse</option>
</select>

        
        <button
          className="bg-blue-400 px-4 py-2 text-white"
          onClick={addNode}
        >
          Create new node
        </button>
        
        <label className="text-black" htmlFor="text">Node Label</label>
        <input
          type="text"
          className="w-full bg-zinc-200 text-black h-10 p-4"
          placeholder="Enter label here"
          value={nodeLabel}
          onChange={handleLabelChange}
          disabled={!selectedNode}
        />
      </div>

        <div className="flex gap-2 flex-col">
          <input
            type="text"
            placeholder="Flowchart Title"
            className="h-10 p-4 w-full text-black bg-zinc-200"
            value={flowchartTitle}
            required
            onChange={(e) => setFlowchartTitle(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-black text-white"
            onClick={saveAsImage}
          >
            Send Flowchart as Image
          </button>
        </div>
      </div>
      <div
        style={{
          width: "calc(100% - 18rem)",
          height: "calc(100% - 2rem)",
          position: "absolute",
          left: 0,
          top: 0,
        }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          className="text-black"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls style={{ color: "black" }} />
        </ReactFlow>
      </div>
    </div>
  );
}
