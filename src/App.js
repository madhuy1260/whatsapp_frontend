import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/messenger/login" element={<Login />} />
          <Route
            path="/messenger/register"
            element={<Register madhu={"madhu"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
