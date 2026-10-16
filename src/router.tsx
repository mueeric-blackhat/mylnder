import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import MyinderFormPage from "./pages/FormPage";



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
]);

export default router;