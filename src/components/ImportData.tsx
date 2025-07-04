import React, { useRef } from "react";
import { FileUp } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { importGraduates } from "@/services/ddlService";
import * as XLSX from "xlsx";

// interface Faculty {
//   id: number;
//   name: string;
//   faculty_code: string;
// }

const ImportData: React.FC = () => {
  // const [faculties, setFaculties] = useState<Faculty[]>([]);
  // const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // useEffect(() => {
  //   const fetchFaculties = async () => {
  //     try {
  //       const data: any = await getDropdowns("faculty");
  //       // setFaculties(data.data);
  //     } catch (error) {
  //       console.error("❌ Failed to fetch faculties:", error);
  //     }
  //   };

  //   fetchFaculties();
  // }, []);

  // const handleSelectFaculty = (faculty: Faculข้อมูลบัณฑิตปัจจุบันty) => {
  //   setSelectedFaculty(faculty);
  // };

  function transformExcelData(data: any[]): any[] {
    return data.map((row: any, index: number) => {
      const fullName = row.GRADNAMET?.trim() || "";

      return {
        id: parseInt(row.GDCODE || index + 1),
        prefix: "",
        first_name: fullName || "-",
        last_name: "",
        degree_level: row.LEVELCODE || "",
        degree_name: row.DEGREENAMET || "",
        faculty_id: parseInt(row.FACULTYCODE || "0"),
        sequence: parseInt(row.DGDCODE || "0"),
        round_id: null,
        has_received_card: 0,
        graduate_type: row.STATUSCODE || null,
      };
    });
  }

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data || !(data instanceof ArrayBuffer)) return;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        console.log("📥 Excel data:", jsonData);

        const transformedData: any = transformExcelData(jsonData);
        const res = await importGraduates(transformedData);
        console.log(transformedData);

        if (res.status === "success") {
          alert("✅ นำเข้าข้อมูลบัณฑิตสำเร็จ");
        } else {
          alert("❌ เกิดข้อผิดพลาดในการนำเข้า");
        }
      } catch (err) {
        console.error("❌ Error importing Excel:", err);
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportSampleExcel = () => {
    const sampleData = [
      {
        GDYEAR: 2565,
        ROUND: 4,
        GDCODE: "00010",
        DGDCODE: "0001",
        GRADNAMET: "ASIFA .",
        STATUSCODE: 0,
        STATUSTXT: "ขาด",
        FACULTYCODE: 10900000,
        FACTNAMET: "คณะวิทยาศาสตร์",
        LEVELCODE: "003",
        DEGREENAMET: "ปรัชญาดุษฎีบัณฑิต",
        GRAD_FOS_ID: 110,
        FOSNAMET: "สาขาวิชาคณิตศาสตร์ประยุกต์",
        EMPLOYEE_ID: 2546080,
        EMPLOYEENAME: "1.1 ผศ.ดร.นงพงา คุณจักร",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "บัณฑิต");

    XLSX.writeFile(workbook, "ตัวอย่างข้อมูลบัณฑิต.xlsx");
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
        นำเข้าข้อมูลบัณฑิต
      </h2>

      {/* <div className="mb-6 text-left">
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
      </div> */}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-orange-200 rounded-lg p-8 text-center">
          <FileUp className="w-12 h-12 mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 mb-4">คลิกเพื่อเลือกไฟล์</p>
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportExcel}
            />

            <div className="flex gap-2">
              <Button type="button" onClick={triggerUpload}>
                เลือกไฟล์
              </Button>
              <Button
                onClick={handleExportSampleExcel}
                className="bg-green-600 hover:bg-green-700 text-white">
                ดาวน์โหลด Excel ตัวอย่าง
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
