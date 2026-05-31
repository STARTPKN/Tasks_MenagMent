import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import moment from "moment";
import "moment/locale/th";

moment.locale("th");

// Lazy load pages for Code Splitting
const Dashboard = lazy(() => import("./pages/dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Users = lazy(() => import("./pages/Users"));
const Trash = lazy(() => import("./pages/Trash"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const Login = lazy(() => import("./pages/Login"));

function App() {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6] '>
      <Suspense
        fallback={
          <div className='w-full h-screen flex items-center justify-center'>
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/completed/:status' element={<Tasks />} />
            <Route path='/in-progress/:status' element={<Tasks />} />
            <Route path='/todo/:status' element={<Tasks />} />
            <Route path='/team' element={<Users />} />
            <Route path='/trashed' element={<Trash />} />
            <Route path='/task/:id' element={<TaskDetails />} />
          </Route>

          <Route path='/log-in' element={<Login />} />
        </Routes>
      </Suspense>

      <Toaster richColors />
    </main>
  );
}

export default App;

