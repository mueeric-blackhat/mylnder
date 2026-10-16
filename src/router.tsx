import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
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
    path: "/HowItWorks",
    element: <HowItWorks />,
  },
  {
    path: "/FAQs",
    element: <FAQs />
  }

  
]);

export default router;