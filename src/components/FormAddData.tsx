// src/components/FormAddData.tsx
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import {
  resetReceivedCards,
  deleteAllGraduationData,
} from "@/services/graduatesService";
import {
  getDropdowns,
  createFaculty,
  deleteFaculty,
} from "@/services/ddlService";

/* ───────────── Types ───────────── */
interface Faculty {
  id: number;
  name: string;
  faculty_code: string;
}

/* ───────────── Component ───────────── */
export default function FormAddData() {
  /* ----- dialog states ----- */
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  // const [newFaculty, setNewFaculty] = useState("");

  const [newFacultyId, setNewFacultyId] = useState("");
  const [newFacultyName, setNewFacultyName] = useState("");

  const handleCreateFaculty = async () => {
    const id = parseInt(newFacultyId.trim());
    const name = newFacultyName.trim();

    if (!id || !name) {
      alert("กรุณากรอกทั้งรหัสคณะและชื่อคณะ");
      return;
    }

    try {
      const res: any = await createFaculty({ id, name });

      if (res.status === "success") {
        setNewFacultyId("");
        setNewFacultyName("");

        if (isDataDialogOpen) {
          const refresh: any = await getDropdowns("faculty");
          setFaculties(refresh.data);
        }
      } else {
        alert("เพิ่มคณะไม่สำเร็จ");
      }
    } catch (err) {
      console.error("❌ createFaculty error:", err);
      alert("เกิดข้อผิดพลาดในการเพิ่มคณะ");
    }
  };

  /* ----- faculties ----- */
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  /* fetch faculties when data dialog is opened */
  useEffect(() => {
    if (!isDataDialogOpen) return;
    (async () => {
      try {
        const res: any = await getDropdowns("faculty");
        setFaculties(res.data as Faculty[]);
      } catch (err) {
        console.error("❌ Failed to fetch faculties:", err);
      }
    })();
  }, [isDataDialogOpen]);

  /* ----- table columns ----- */
  const columns = useMemo<ColumnDef<Faculty>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "ชื่อคณะ" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => handleDeleteFaculty(row.original.id)}
            className="text-red-600 hover:text-red-800"
            title="ลบคณะ">
            <Trash2 size={18} />
          </button>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    []
  );

  const handleDeleteFaculty = async (id: number) => {
    const confirmDelete = window.confirm("คุณต้องการลบคณะนี้ใช่หรือไม่?");
    if (!confirmDelete) return;

    try {
      const res: any = await deleteFaculty(id);

      if (res.status === "success") {
        alert("ลบสำเร็จ");

        // 🔄 รีโหลดข้อมูลใหม่
        const refresh: any = await getDropdowns("faculty");
        setFaculties(refresh.data);
      } else {
        alert("ลบไม่สำเร็จ");
      }
    } catch (err) {
      console.error("❌ deleteFaculty error:", err);
      alert("เกิดข้อผิดพลาดในการลบคณะ");
    }
  };

  /* ----- table instance ----- */
  const table = useReactTable({
    data: faculties,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ----- actions ----- */
  const handleConfirmReset = async () => {
    try {
      await resetReceivedCards();
      // 🔄 refresh data (ถ้ามี) ที่นี่
    } catch (err) {
      console.error("❌ resetReceivedCards error:", err);
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  const handleDeleteReset = async () => {
    try {
      await deleteAllGraduationData();
      // 🔄 refresh data (ถ้ามี) ที่นี่
    } catch (err) {
      console.error("❌ deleteAllGraduationData error:", err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  /* ───────────── Render ───────────── */
  return (
    <>
      {/* ===== Reset Confirm Dialog ===== */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการรีเซ็ตค่ารับปริญญา</DialogTitle>
            <DialogDescription>
              คุณต้องการรีเซ็ตสถานะ "รับบัตร" ของบัณฑิตทั้งหมดใช่หรือไม่?
              <br />
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={handleConfirmReset}>
              ยืนยันรีเซ็ต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle> คุณต้องการลบข้อมูลใช่หรือไม่?</DialogTitle>
            <DialogDescription>
              คุณต้องการลบข้อมูลใช่หรือไม่?
              <br />
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={handleDeleteReset}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Faculty List Dialog ===== */}
      <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ข้อมูลคณะทั้งหมด</DialogTitle>
          </DialogHeader>

          {/* table */}
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="bg-gray-50">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
                        className="px-6 py-3 text-sm text-gray-700">
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

          {/* pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) =>
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(e.target.value),
                  })
                }>
                {[5, 10, 20, 50].map((size) => (
                  <option key={size}>{size}</option>
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDataDialogOpen(false)}>
              ยกเลิก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Main Card ===== */}
      <Card className="bg-white shadow-xl border border-orange-100">
        {/* reset */}
        <CardHeader>
          <CardTitle className="text-orange-600">รีเซ็ตค่ารับปริญญา</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setIsResetDialogOpen(true)}>
            รีเซ็ตค่ารับปริญญา
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setDeleteDialogOpen(true)}>
            ลบข้อมูลบัณฑิต
          </Button>
        </CardContent>

        <CardHeader>
          <CardTitle className="text-orange-600">เพิ่มข้อมูลคณะ</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            placeholder="กรอกรหัสคณะ (ID)..."
            className="mb-4"
            value={newFacultyId}
            onChange={(e) => setNewFacultyId(e.target.value)}
          />
          <Input
            placeholder="กรอกชื่อคณะ..."
            className="mb-4"
            value={newFacultyName}
            onChange={(e) => setNewFacultyName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleCreateFaculty}>
              บันทึก
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => setIsDataDialogOpen(true)}>
              ดูข้อมูลคณะทั้งหมด
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
