import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";



const router = createBrowserRouter([
    {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  
]);

export default router;