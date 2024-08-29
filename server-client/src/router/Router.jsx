import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import Signup from "../components/Signup";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UpdateProfile from "../pages/Dashboard/UpdateProfile";
import Cart from "../pages/shop/Cart";


const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children:[
        {
          path: "/",
          element : <Home/>
        },
        {
          path: "/menu",
          element : <Menu/> 
        },
        {
          path: "/update-profile",
          element: <UpdateProfile/>
        },
        {
          path: "/cart-page",
          element: <Cart/>
        }
      ]
    },
    {
      path: "/signup",
      element: <Signup/>,}

  ]);

  export default router