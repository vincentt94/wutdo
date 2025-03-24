import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from "./app.tsx"
import Home from "./pages/home.tsx";
import SignUp from "./pages/signup.tsx";
import Login from "./pages/login.tsx";
import MyNotes from "./pages/mynotes.tsx";
import ErrorPage from "./pages/errorpage.tsx"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/mynotes",
                element: <MyNotes />,
            }
        ],
    },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}