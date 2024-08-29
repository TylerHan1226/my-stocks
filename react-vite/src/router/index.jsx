import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage'
import Layout from './Layout';
import News from '../components/News/News';
import SearchPage from '../components/Search/SearchPage';
import AllLists from '../components/MyList/AllLists';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/news/:page",
        element: <News />
      },
      {
        path: "/search/:searchInput",
        element: <SearchPage />
      },
      {
        path: "/my_lists",
        element: <AllLists />
      },
      {
        path:'*',
        element: <h1>Page not found</h1>
      },
    ],
  },
]);