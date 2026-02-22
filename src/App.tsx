import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GenRule from "./pages/GenRule";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gen-rule" element={<GenRule />} />
      </Routes>
    </BrowserRouter>
  );
}