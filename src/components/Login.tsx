import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { login } from "@/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore"; 
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await login({ name: username, password });

    if (res.status === "success" && res.data?.token) {
      const token = res.data.token;
      setToken(token);
      const redirectTo = (location.state as any)?.from?.pathname || "/";
      navigate(redirectTo, { replace: true }); // ✅ กลับไปยังหน้าก่อน login
    } else {
      setErrorMsg(res.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-gray-700 mb-1">
                พิธีพระราชทานปริญญาบัตร ประจำปีการศึกษา 2568
              </h1>
              <h2 className="text-3xl bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Graduation Ceremony
              </h2>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-8">
              <CardTitle className="text-3xl text-gray-800">
                เข้าสู่ระบบ
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                กรุณาใส่ชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-gray-700">
                    ชื่อผู้ใช้
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="กรุณาใส่ชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-base border-2 border-gray-200 rounded-lg transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700">
                    รหัสผ่าน
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="กรุณาใส่รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base border-2 border-gray-200 rounded-lg transition-all duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg">
                  เข้าสู่ระบบ
                </Button>
                {errorMsg && (
                  <p className="mt-4 text-red-500 text-sm text-center">
                    {errorMsg}
                  </p>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  ระบบจัดการพิธีพระราชทานปริญญาบัตร
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 King Mongkut's University of Technology Thonburi By Chanakarn Kruehong</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
