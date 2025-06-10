import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { getNextGraduates } from "@/services/graduatesService";
interface Props {
  isUpdate: number;
}
// 🎓 กำหนด columns
const columns: ColumnDef<any>[] = [
  {
    header: "ชื่อ",
    accessorKey: "first_name",
    cell: (info) => info.getValue(),
  },
  {
    header: "นามสกุล",
    accessorKey: "last_name",
    cell: (info) => info.getValue(),
  },
  {
    header: "คณะ",
    accessorKey: "faculty_name",
    cell: (info) => info.getValue(),
  },
];

const NextGraduatesTable = ({ isUpdate }: Props) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const res = await getNextGraduates();
        if (res.status === "success") {
          setData(res.data ?? []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch next graduates:", err);
      }
    };

    fetchNext();
  }, [isUpdate]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">ผู้ที่รอเรียกถัดไป</h2>

      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
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
                <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NextGraduatesTable;
