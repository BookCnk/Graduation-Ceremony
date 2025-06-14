import { useEffect, useState } from "react";
import { UserPlus, Users, Key, Trash2, Edit2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";

import { getAllUser, register, changePassword } from "@/services/api";

interface User {
  id: number;
  username: string;
  role: string;
  lastLogin: string;
}

const Settings = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState<"users" | "add" | "password">(
    "users"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const userFromToken: any = useAuthStore((state) => state.user);
  console.log(userFromToken);

  // Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const fetchUsers = async () => {
    try {
      const res = await getAllUser();
      if (res.status === "success" && Array.isArray(res.data)) {
        const mappedUsers = res.data.map((user: any) => ({
          id: user.id,
          username: user.name,
          role: user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน",
          lastLogin: user.last_login,
        }));
        setUsers(mappedUsers);
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อ API ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserLoading(true);

    try {
      const response = await register({
        name: newUsername,
        password: newUserPassword,
        role: newUserRole,
      });

      if (response.status === "success") {
        setNewUsername("");
        setNewUserPassword("");
        setNewUserRole("user");
        setActiveTab("users"); // Go back to users tab
      } else {
        setAddUserError(response.message || "ไม่สามารถเพิ่มผู้ใช้ได้");
      }
    } catch (error) {
      setAddUserError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    } finally {
      setAddUserLoading(false);
      await fetchUsers();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await changePassword({
        name: userFromToken.name,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      console.log("✅ เปลี่ยนรหัสผ่านสำเร็จ:", res.message || res);
      setErrorMessage("");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMessage(err.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-orange-100">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === "users"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-600"
          }`}>
          <Users className="w-5 h-5" />
          <span>รายชื่อผู้ใช้งาน</span>
        </button>
        {userFromToken?.role === "admin" && (
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 flex items-center space-x-2 ${
              activeTab === "add"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-orange-600"
            }`}>
            <UserPlus className="w-5 h-5" />
            <span>เพิ่มผู้ใช้งาน</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === "password"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-600"
          }`}>
          <Key className="w-5 h-5" />
          <span>เปลี่ยนรหัสผ่าน</span>
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "users" && (
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                รายชื่อผู้ใช้งาน
              </CardTitle>
              <CardDescription>จัดการผู้ใช้งานในระบบ</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-orange-100">
                        <th className="text-left py-3 px-4 text-gray-600">
                          ชื่อผู้ใช้
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          บทบาท
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600">
                          เข้าสู่ระบบล่าสุด
                        </th>
                        <th className="text-right py-3 px-4 text-gray-600">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-orange-50 hover:bg-orange-50/50">
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.role}</td>
                          <td className="py-3 px-4">{user.lastLogin}</td>
                          <td className="py-3 px-4 text-right">
                            {userFromToken?.role === "admin" && (
                              <>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="text-orange-600 hover:text-orange-70 0 p-2">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="text-red-500 hover:text-red-600 p-2">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>แก้ไขผู้ใช้งาน</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลผู้ใช้งาน {selectedUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">ชื่อผู้ใช้</Label>
                <Input
                  id="edit-username"
                  defaultValue={selectedUser?.username}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">บทบาท</Label>
                <select
                  id="edit-role"
                  defaultValue={selectedUser?.role}
                  className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none">
                  <option value="user">ผู้ใช้งาน</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ยืนยันการลบผู้ใช้งาน</DialogTitle>
              <DialogDescription>
                คุณต้องการลบผู้ใช้งาน {selectedUser?.username} ใช่หรือไม่?
                การกระทำนี้ไม่สามารถย้อนกลับได้
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User Tab */}
        {activeTab === "add" && (
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                เพิ่มผู้ใช้งานใหม่
              </CardTitle>
              <CardDescription>
                กรอกข้อมูลเพื่อเพิ่มผู้ใช้งานใหม่
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAddUser}>
                <div className="space-y-2">
                  <Label htmlFor="username">ชื่อผู้ใช้</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="กรอกชื่อผู้ใช้"
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน"
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">บทบาท</Label>
                  <select
                    id="role"
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none">
                    <option value="user">ผู้ใช้งาน</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                  </select>
                </div>
                {addUserError && (
                  <p className="text-red-500 text-sm">{addUserError}</p>
                )}
                <Button
                  type="submit"
                  disabled={addUserLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  {addUserLoading ? "กำลังเพิ่ม..." : "เพิ่มผู้ใช้งาน"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                เปลี่ยนรหัสผ่าน
              </CardTitle>
              <CardDescription>เปลี่ยนรหัสผ่านของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">รหัสผ่านปัจจุบัน</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                    className="border-orange-200 focus:border-orange-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">รหัสผ่านใหม่</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="กรอกรหัสผ่านใหม่"
                    className="border-orange-200 focus:border-orange-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className={`border-orange-200 focus:border-orange-500 ${
                      confirmPassword && !passwordsMatch ? "border-red-500" : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-red-500">รหัสผ่านไม่ตรงกัน</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!passwordsMatch}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50">
                  เปลี่ยนรหัสผ่าน
                </Button>
              </form>

              {errorMessage && (
                <p className="text-sm text-red-500 text-center">
                  {errorMessage}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;
