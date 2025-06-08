import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getGraduates } from "@/services/graduatesService";
import { getDropdowns } from "@/services/ddlService";

// 🎓 กำหนด column
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
interface Faculty {
  id: number;
  name: string;
  faculty_code: string;
}

const TablePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res: any = await getDropdowns("faculty");
        setFaculties(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch faculties:", error);
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGraduates({
          facultyId: selectedFaculty?.id || 2,
          page: pageIndex + 1,
          pageSize,
        });
        setData(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ", err);
      }
    };

    fetchData();
  }, [pageIndex, pageSize, selectedFaculty]);

  const handleSelectFaculty = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <div className="overflow-x-auto">
        {/* 🔽 Dropdown คณะ */}
        <div className="mb-4 w-full max-w-sm">
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

        {/* 📋 Table */}
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

      {/* 🔁 Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}>
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}>
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default TablePage;
