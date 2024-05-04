import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/Error";
import RootLayout from "./layouts/RootLayout";
import { PATHS } from "./constants/Navigation";
import Submitted from "./pages/Submitted";
import "./index.css";
import AuthUserProvider from "./auth/AuthUserProvider"


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            ...PATHS.map((item) => ({
                path: item.link,
                element: item.element,
            })),
            {
                path: "/formsubmitted", // Define the path for the FormSubmittedPage
                element: <Submitted />, // Specify the element to render for FormSubmittedPage
            },
        ],
    },
]);

export default function App() {
    return (
        <AuthUserProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
            <RouterProvider router={router} />
        </MantineProvider>
        </AuthUserProvider>
    );
}

