import CesiumViewer from "./components/CesiumViewer";
import "./App.css";

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
    </div>
  );
}

export default App;
