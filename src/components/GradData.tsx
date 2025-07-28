import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import socket from "@/socket";

interface Graduate {
  id: number;
  name: string;
  order: number;
  faculty: string;
  round: number;
  degree_level: string;
  degree_name: string;
}

interface SummaryData {
  current_round: number;
  total_in_round: number;
  already_called: number;
  remaining: number;
  latest_called_sequence: number | null;
  total_all_rounds: number;
}

const GradData = () => {
  const [graduate, setGraduate] = useState<Graduate | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaryAll, setSummaryAll] = useState<any>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [nextData, setNextData] = useState<any[]>([]);

  useEffect(() => {
    const handleGraduateSummary = (payload: any) => {
      console.log(payload);

      if (payload.status === "success") {
        const {
          first_graduate,
          next_graduates,
          round_summary,
          graduate_summary,
        } = payload.data;

        console.log(payload.data);

        if (first_graduate) {
          const {
            id,
            first_name,
            sequence,
            degree_name,
            faculty_name,
            round_number,
            degree_level,
          } = first_graduate;

          setGraduate({
            id,
            name: first_name,
            order: sequence,
            faculty: faculty_name,
            degree_name: `(${degree_name})`,
            round: round_number,
            degree_level,
          });
        } else {
          setGraduate(null);
        }

        if (next_graduates) setNextData(next_graduates);
        if (round_summary) {
          setSummary({
            current_round: round_summary.current_round,
            total_in_round: Number(round_summary.total_in_round),
            already_called: Number(round_summary.already_called),
            remaining: Number(round_summary.remaining),
            latest_called_sequence: round_summary.latest_called_sequence,
            total_all_rounds: Number(round_summary.total_all_rounds),
          });
        } else {
          setSummary(null); 
        }

        if (graduate_summary) {
          setSummaryAll(graduate_summary);
        }

        setLoading(false);
        setSummaryLoading(false);
      }
    };

    // const handleGraduateSummarySimple = (payload: any) => {
    //   if (payload.status === "success") {
    //     console.log(payload.data.graduate_summary);

    //     setSummaryAll(payload.data.graduate_summary);
    //   }
    // };

    socket.on("graduate-summary", handleGraduateSummary);
    // socket.on("graduate-overview", handleGraduateSummarySimple);

    socket.emit("request-summary");

    return () => {
      socket.off("graduate-summary", handleGraduateSummary);
      // socket.off("graduate-overview", handleGraduateSummarySimple);
    };
  }, []);

  const percentage = summary?.total_in_round
    ? Math.round((summary.already_called / summary.total_in_round) * 100)
    : 0;

  const columns: ColumnDef<any>[] = [
    {
      header: "ชื่อ",
      accessorKey: "first_name",
      cell: (info) => info.getValue(),
    },
    {
      header: "คณะ",
      accessorKey: "faculty_name",
      cell: (info) => info.getValue(),
    },
    {
      header: "สาขา",
      accessorKey: "major",
      cell: (info) => info.getValue(),
    },
    {
      header: "รอบ",
      accessorKey: "round_number",
      cell: (info) => info.getValue(),
    },
  ];

  const table = useReactTable({
    data: nextData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-4 md:px-8 lg:px-16 py-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <p className="text-orange-600 text-xl animate-pulse">
              กำลังโหลด...
            </p>
          </div>
        )}

        {graduate && (
          <div className="space-y-6 relative z-0">
            <h2 className="text-3xl font-bold mb-6 text-orange-700 text-center border-b pb-2">
              ข้อมูลบัณฑิตปัจจุบัน
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-lg text-gray-500 mb-1">
                    ชื่อ-สกุล
                  </label>
                  <p className="text-3xl font-semibold text-gray-900 tracking-wide">
                    {graduate.name}
                  </p>
                </div>

                <div>
                  <label className="block text-lg text-gray-500 mb-1">
                    รอบและลำดับ
                  </label>
                  <p className="text-3xl font-semibold text-orange-700">
                    รอบ {graduate.round} ลำดับที่ {graduate.order}
                  </p>
                </div>

                <div>
                  <label className="block text-lg text-gray-500 mb-1">
                    สาขา/คณะ
                  </label>
                  <p className="text-2xl font-medium text-gray-700">
                    {graduate.faculty}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    สาขา
                  </label>
                  <p className="text-xl font-medium text-gray-700">
                    {graduate.degree_level}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    ปริญญา
                  </label>
                  <p className="text-xl font-medium text-gray-700">
                    {graduate.degree_name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between w-full h-full space-y-8">
                <div>
                  <label className="block text-4xl text-gray-500 mb-2">
                    บัณฑิตรวม
                  </label>
                  <p className="text-8xl font-extrabold text-gray-900 tracking-tight leading-none">
                    {summaryAll?.received ?? "-"}/
                    {summaryAll?.total_graduates ?? "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-4xl text-gray-500 mb-2">
                    ยอดคงเหลือ
                  </label>
                  <p className="text-8xl font-extrabold text-gray-900 tracking-tight leading-none">
                    {summaryAll?.not_received ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!graduate && !loading && (
          <p className="text-red-600 text-xl text-center">ไม่พบข้อมูลบัณฑิต</p>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4">
            ผู้ที่รอเรียกถัดไป 2 คน
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-base font-semibold text-gray-700 border-b border-gray-300">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-base text-gray-800">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-orange-100">
          <h2 className="text-2xl font-semibold mb-4">
            ความคืบหน้าพิธีมอบปริญญา
          </h2>

          {summaryLoading ? (
            <p className="text-base text-muted-foreground">กำลังโหลดสถานะ…</p>
          ) : summary ? (
            // ✅ Case: มี summary → แสดง progress bar
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-base text-muted-foreground">
                    ความคืบหน้ารอบที่ {summary.current_round}
                  </span>
                  <span className="text-base font-medium">{percentage}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.total_in_round}</p>
                  <p className="text-base text-muted-foreground">ทั้งหมด</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.already_called}</p>
                  <p className="text-base text-muted-foreground">เรียกแล้ว</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{summary.remaining}</p>
                  <p className="text-base text-muted-foreground">คงเหลือ</p>
                </div>
              </div>
            </div>
          ) : summaryAll && Number(summaryAll.not_received) === 0 ? (
            // ✅ Case: ไม่มี summary + เข้ารับครบแล้ว
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-green-600">🎓 เสร็จสิ้น</p>
              <p className="text-base text-muted-foreground">
                บัณฑิตทั้งหมด {summaryAll.total_graduates} คน เข้ารับครบแล้ว
              </p>
            </div>
          ) : summaryAll ? (
            // ✅ Case: ไม่มี summary แต่ยังเหลืออยู่ → แสดงว่าเสร็จสิ้นรอบแต่ภาพรวมยังไม่จบ
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-green-600">
                🎓 เสร็จสิ้นรอบนี้
              </p>
              <p className="text-base text-muted-foreground">
                บัณฑิตทั้งหมด {summaryAll.total_graduates} คน เข้ารับแล้ว{" "}
                {summaryAll.received} คน
              </p>
            </div>
          ) : (
            // ❌ ไม่มีอะไรเลย
            <p className="text-base text-red-500">ไม่มีข้อมูล</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradData;
