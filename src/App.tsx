import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Built with React, Vite, TypeScript and Tailwind CSS.
        </footer>
      </div>
    </BrowserRouter>
  );
}