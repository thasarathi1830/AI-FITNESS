import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FoodPage from './pages/FoodPage';
import ActivityPage from './pages/ActivityPage';
import ExercisesPage from './pages/ExercisesPage';
import ProfilePage from './pages/ProfilePage';
import TrainersPage from './pages/TrainersPage';
import TrainerDetailPage from './pages/TrainerDetailPage';
import RegisterTrainerPage from './pages/RegisterTrainerPage';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected routes with sidebar */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <Sidebar />
                                    <Layout>
                                        <Routes>
                                            <Route path="/dashboard" element={<DashboardPage />} />
                                            <Route path="/food" element={<FoodPage />} />
                                            <Route path="/activity" element={<ActivityPage />} />
                                            <Route path="/exercises" element={<ExercisesPage />} />
                                            <Route path="/trainers" element={<TrainersPage />} />
                                            <Route path="/trainers/:id" element={<TrainerDetailPage />} />
                                            <Route path="/register-trainer" element={<RegisterTrainerPage />} />
                                            <Route path="/profile" element={<ProfilePage />} />
                                        </Routes>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
