import React, { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importGraduates } from "@/services/ddlService";
import * as XLSX from "xlsx";

const ImportData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const transformExcelData = (data: any[]): any[] => {
    const facultySequenceMap: Record<number, number> = {};

    return data
      .filter((row: any) => row.PARTICIPATION == "1")
      .map((row: any, index: number) => {
        const fullName = row.GRADNAMET?.trim() || "";
        const facultyId = parseInt(row.FACULTYCODE || "0");
        const dgdcCode = parseInt(row.DGDCODE || "0");

        if (!facultySequenceMap[facultyId]) {
          facultySequenceMap[facultyId] = 1;
        } else {
          facultySequenceMap[facultyId]++;
        }

        return {
          id: parseInt(row.GDCODE || `${index + 1}`),
          prefix: "",
          first_name: fullName || "-",
          last_name: "",
          degree_level: row.FOSNAMET || "",
          degree_name: row.DEGREENAMET || "",
          faculty_id: facultyId,
          sequence: facultySequenceMap[facultyId],
          round_id: null,
          has_received_card: 0,
          graduate_type: row.STATUSCODE || null,
          global_sequence: dgdcCode,
        };
      });
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data || !(data instanceof ArrayBuffer)) return;

      try {
        setLoading(true); // 🔄 Start loading
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const transformedData = transformExcelData(jsonData);
        const res = await importGraduates(transformedData);

        if (res.status === "success") {
          alert("✅ นำเข้าข้อมูลบัณฑิตสำเร็จ");
        } else {
          alert("❌ เกิดข้อผิดพลาดในการนำเข้า");
        }
      } catch (err) {
        console.error("❌ Error importing Excel:", err);
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
      } finally {
        setLoading(false); // ✅ Stop loading
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

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <img
            src="/assets/loading.svg"
            alt="Loading..."
            className="w-20 h-20"
          />
        </div>
      )}

      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          นำเข้าข้อมูลบัณฑิต
        </h2>
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
    </div>
  );
};

export default ImportData;
