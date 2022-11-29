import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Messenger from "./components/Messenger";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/messenger/login" element={<Login />} />
          <Route exact path="/messenger/register" element={<Register />} />
          <Route exact path="/" element={<Messenger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
