import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import PetList from "./components/PetList";
import PetDetails from "./pages/PetDetails";
import PetRegistrationForm from "./pages/PetRegistrationForm";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserDetails from "./pages/UserDetails";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* RUTAS PUBLICAS */}
      <Route path="/" element={
        <ProtectedRoute onlyAnon={true}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/about" element={
        <ProtectedRoute onlyAnon={true}>
          <About />
        </ProtectedRoute>
      } />

      <Route path="/contact" element={
        <ProtectedRoute onlyAnon={true}>
          <Contact />
        </ProtectedRoute>
      } />

      <Route path="/signup" element={
        <ProtectedRoute onlyAnon={true}>
          <Signup />
        </ProtectedRoute>
      } />

      <Route path="/login" element={
        <ProtectedRoute onlyAnon={true}>
          <Login />
        </ProtectedRoute>
      } />

      {/* RUTAS PRIVADAS */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/user/:userId" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />

      <Route path="/pets" element={
        <ProtectedRoute>
          <PetList userId={1} />
        </ProtectedRoute>
      } />

      <Route path="/pets/:petId" element={
        <ProtectedRoute>
          <PetDetails />
        </ProtectedRoute>
      } />

      <Route path="/register-pet" element={
        <ProtectedRoute>
          <PetRegistrationForm />
        </ProtectedRoute>
      } />

      <Route path="/demo" element={
        <ProtectedRoute>
          <Demo />
        </ProtectedRoute>
      } />

      <Route path="/pet" element={
        <ProtectedRoute>
          <Demo />
        </ProtectedRoute>
      } />

      {/* RUTAS ADMIN */}
      <Route path="/admin-panel" element={
        <ProtectedRoute adminOnly={true}>
          <AdminPanel />
        </ProtectedRoute>
      } />

      <Route path="/admin/user/:userId" element={
        <ProtectedRoute adminOnly={true}>
          <UserDetails />
        </ProtectedRoute>
      } />

      <Route path="/single/:theId" element={
        <ProtectedRoute>
          <Single />
        </ProtectedRoute>
      } />

    </Route>
  )
);
