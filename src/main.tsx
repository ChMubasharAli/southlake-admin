import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// react toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import from mantine.dev
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

// import Components for routing
import App from "./App.tsx";
import {
  AfterSchool,
  AfterSchoolEditPage,
  AnnualRegistration,
  Dashboard,
  EnrolledStudents,
  InPersonPrivateTutoring,
  InPersonPrivateTutoringEditPage,
  InPersonPrivateTutoringLessonEditPage,
  MusicClasses,
  MusicClassesEditPage,
  OnlinePrivateTutoring,
  OnlinePrivateTutoringEditPage,
  Payment,
  Programs,
  SingleProgramEditPage,
  SingleProgramEnrolledStudents,
  SouthlakeCamps,
  SouthlakeCampEditPage,
  Users,
  LoginPage,
} from "./components/index.ts";
import Testing from "./components/Testing.tsx";
import OnlinePrivateTutoringEnrolledStudents from "./components/Private/OnlinePrivateTutoringEnrolledStudents.tsx";
import InPersonPrivateTutoringEnrolledStudents from "./components/InPerson-Tutoring/InPersonPrivateTutoringEnrolledStudents.tsx";
import MusicClassesEnrolledStudents from "./components/Music-Classes/MusicClassesEnrolledStudents.tsx";
import SouthlakeCampsEnrolledStudents from "./components/Southlake-Camps/SouthlakeCampsEnrolledStudents.tsx";

const router = createBrowserRouter([
  {
    path: "/login", // Define /login route separately
    element: <LoginPage />, // This route is publicly accessible
  },
  {
    path: "/",
    element: <App />, // App is used as the layout
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/after-school",
        element: <AfterSchool />,
      },
      {
        path: "/after-school-edit-page",
        element: <AfterSchoolEditPage />,
      },
      {
        path: "/after-school-program-enrolled-students",
        element: <EnrolledStudents />,
      },
      {
        path: "/programs",
        element: <Programs />,
      },
      {
        path: "/single-program-edit-page",
        element: <SingleProgramEditPage />,
      },
      {
        path: "/single-program-enrolled-students",
        element: <SingleProgramEnrolledStudents />,
      },
      {
        path: "/private",
        element: <OnlinePrivateTutoring />,
      },
      {
        path: "/online-private-tutoring-edit-page",
        element: <OnlinePrivateTutoringEditPage />,
      },
      {
        path: "/online-private-tutoring-enrolled-students",
        element: <OnlinePrivateTutoringEnrolledStudents />,
      },
      {
        path: "/person-private-tutoring",
        element: <InPersonPrivateTutoring />,
      },
      {
        path: "/person-private-tutoring-edit-page",
        element: <InPersonPrivateTutoringEditPage />,
      },

      {
        path: "/person-private-tutoring-lesson-edit-page",
        element: <InPersonPrivateTutoringLessonEditPage />,
      },
      {
        path: "/person-private-tutoring-enrolled-students",
        element: <InPersonPrivateTutoringEnrolledStudents />,
      },
      {
        path: "/music-classes",
        element: <MusicClasses />,
      },
      {
        path: "/music-classes-edit-page",
        element: <MusicClassesEditPage />,
      },
      {
        path: "/music-classes-enrolled-students",
        element: <MusicClassesEnrolledStudents />,
      },
      {
        path: "/southlake-camps",
        element: <SouthlakeCamps />,
      },
      {
        path: "/southlake-camp-edit-page",
        element: <SouthlakeCampEditPage />,
      },
      {
        path: "/southlake-camps-enrolled-students",
        element: <SouthlakeCampsEnrolledStudents />,
      },
      {
        path: "/annual-registration",
        element: <AnnualRegistration />,
      },

      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/testing",
        element: <Testing />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <ToastContainer />
    <RouterProvider router={router} />
  </MantineProvider>
);
