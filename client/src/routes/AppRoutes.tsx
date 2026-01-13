import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Gigs from '../pages/Gigs';
import GigDetails from '../pages/GigDetails';
import Dashboard from '../pages/Dashboard';
import AddGig from '../pages/AddGig';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>

          <Route path="/" element={<Gigs />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/:id" element={<GigDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddGig />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes;
