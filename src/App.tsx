import CesiumViewer from "./components/CesiumViewer";
import "./App.css";
import { DataReceiver } from "./components/DataReceiver";

function App() {
  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <CesiumViewer />
      {/* WebSocket connection for plane data */}
      <DataReceiver />
    </div>
  );
}

export default App;
