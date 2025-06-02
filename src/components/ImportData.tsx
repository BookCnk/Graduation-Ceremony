import React, { useEffect, useState } from "react";
import { FileUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getDropdowns } from "@/services/ddlService";

interface Faculty {
  id: number;
  name: string;
  faculty_code: string;
}

const ImportData: React.FC = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data: any = await getDropdowns("faculty");
        setFaculties(data.data);
      } catch (error) {
        console.error("❌ Failed to fetch faculties:", error);
      }
    };

    fetchFaculties();
  }, []);

  const handleSelectFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    // เพิ่ม logic โหลดข้อมูลจาก faculty.id ได้ที่นี่
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
        นำเข้าข้อมูลบัณฑิต
      </h2>

      <div className="mb-6 text-left">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          เลือกคณะ
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedFaculty?.name ?? "เลือกคณะ"}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={4}
            className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuLabel>รายชื่อคณะ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {faculties.map((faculty) => (
              <DropdownMenuItem
                key={faculty.id}
                onClick={() => handleSelectFaculty(faculty)}>
                {faculty.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-orange-200 rounded-lg p-8 text-center cursor-pointer">
          <FileUp className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 mb-4">
            ลากไฟล์ Excel หรือคลิกเพื่อเลือกไฟล์
          </p>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md">
            เลือกไฟล์
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
