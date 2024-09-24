import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage'
import Layout from './Layout';
import SearchPage from '../components/Search/SearchPage';
import AllLists from '../components/MyList/AllLists';
import List from '../components/MyList/List';
import LandingPageBeta from '../components/LandingPage/LandingPageBeta';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/landingBeta",
        element: <LandingPageBeta />,
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
        path: "/search/:searchInput",
        element: <SearchPage />
      },
      {
        path: "/my_lists",
        element: <AllLists />
      },
      {
        path: "/my_lists/:listName",
        element: <List />
      },
      {
        path:'*',
        element: <h1>Page not found</h1>
      },
    ],
  },
]);