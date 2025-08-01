import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import {
  GraduationCap,
  FileUp,
  Settings as SettingsIcon,
  Hash,
  BarChart,
  BarChart2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore"; // ✅ Update path if needed
import Login from "./components/Login";
import Settings from "./components/Settings";
import ImportData from "@/components/ImportData";
import Summary from "@/components/Summary";
import Dashboard from "@/components/Dashboard"; // path ตามที่คุณจัดโฟลเดอร์
import NumberDisplay from "@/components/NumberDisplay"; // path ตามที่คุณจัดโฟลเดอร์
import GradData from "@/components/GradData";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (
    !user &&
    location.pathname !== "/number" &&
    location.pathname !== "/grad-data"
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// const NumberDisplay = () => {
//   const [currentNumber] = useState(1);
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-9xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
//         {currentNumber}
//       </div>
//     </div>
//   );
// };

function App() {
  const { logout, isTokenExpired } = useAuthStore();

  useEffect(() => {
    if (isTokenExpired()) {
      logout();
    }
  }, [isTokenExpired, logout]);

  const currentGraduate = {
    name: "John Doe",
    order: 1,
    faculty: "Engineering",
  };

  const [progress, setProgress] = useState({
    total: 100,
    called: 0,
    remaining: 100,
  });

  const handleNextGraduate = () => {
    setProgress((prev) => ({
      ...prev,
      called: prev.called + 1,
      remaining: prev.remaining - 1,
    }));
  };

  return (
    <Routes>

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/number" element={<NumberDisplay />} />
      <Route path="/grad-data" element={<GradData />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
              <header className="border-b bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        Graduation Ceremony Admin
                      </h1>
                      <p className="text-sm text-gray-600">
                        ระบบจัดการพิธีพระราชทานปริญญาบัตร
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <nav className="flex space-x-2">
                      <Link
                        to="/"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors">
                        หน้าหลัก
                      </Link>
                      <Link
                        to="/number"
                        target="_blank"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        แสดงตัวเลข
                      </Link>
                      <Link
                        to="/grad-data"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center">
                        <BarChart2 className="w-4 h-4 mr-2" />
                        แสดงยอด
                      </Link>
                      <Link
                        to="/import"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center">
                        <FileUp className="w-4 h-4 mr-2" />
                        นำเข้าข้อมูล
                      </Link>
                      <Link
                        to="/summary"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center">
                        <BarChart className="w-4 h-4 mr-2" />
                        ภาพรวมข้อมูล
                      </Link>
                      <Link
                        to="/settings"
                        className="px-4 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors flex items-center">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        ตั้งค่า
                      </Link>
                    </nav>
                    <button
                      onClick={logout}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200">
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </header>

              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Dashboard
                        currentGraduate={currentGraduate}
                        progress={progress}
                        handleNextGraduate={handleNextGraduate}
                      />
                    }
                  />
                  <Route path="/import" element={<ImportData />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/summary" element={<Summary />} />
                  <Route path="/grad-data" element={<GradData />} />
                </Routes>
              </main>

              <footer className="text-center py-6 text-gray-500 text-sm">
                <p>
                  © 2024 King Mongkut's University of Technology Thonburi By
                  Chanakarn Kruehong
                </p>
              </footer>
            </div>
          </ProtectedRoute>
        }
      />
      {/* Catch all other routes and redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
