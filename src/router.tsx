import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MyinderFormPage from "./pages/FormPage";
import HowItWorks from "./components/HowItWorks";
import FAQs from "./components/FAQs"; 




const router = createBrowserRouter([
    {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/create",
    element: <MyinderFormPage />,
  },
  { 
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/faqs",
    element: <FAQs />
  }

]);

export default router;