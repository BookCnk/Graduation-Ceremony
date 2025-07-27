/* GroupedFacultyInput.tsx */
import { useEffect, useRef, useState, useCallback } from "react";
import { getQuotaGroups, saveQuotaGroups } from "@/services/graduatesService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GripHorizontal, PlusCircle, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";


/* ---------- helpers ---------- */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));
function uniqByIdMax<T extends { id: number; student_count: number }>(
  arr: T[]
) {
  return [
    ...arr
      .reduce((m, cur) => {
        const prev = m.get(cur.id);
        if (!prev || cur.student_count > prev.student_count) m.set(cur.id, cur);
        return m;
      }, new Map<number, T>())
      .values(),
  ];
}
const parseRoundNo = (title: string) =>
  parseInt(title.replace(/[^\d]/g, ""), 10) || 0;

/* ---------- types ---------- */
interface FacultyItem {
  id: number;
  name: string;
  value: number;
  student_count: number;
}
interface Group {
  round: number; // หมายเลขรอบถาวร
  title: string; // “รอบที่ X” เอาไว้แสดง
  items: FacultyItem[];
}

/* ---------- DraggableFaculty ---------- */
const DraggableFaculty = ({
  item,
  groupId,
  maxAllowed,
  onValueChange,
}: {
  item: FacultyItem;
  groupId: string;
  maxAllowed: number;
  onValueChange: (id: number, value: number) => void;
}) => {
  const [inputValue, setInputValue] = useState(item.value.toString());

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({
      id: `draggable-${groupId}-${item.id}`,
      data: {
        item: {
          ...item,
          value: Number(inputValue || "0"),
        },
        groupId,
      },
    });
  const stripScale = (t: string) => t.replace(/scale[XY]?\([^)]+\)/g, "");
  const style = {
    ...(transform
      ? {
          transform: `${stripScale(
            CSS.Transform.toString(transform) || ""
          )} scale(1)`,
          zIndex: 9999,
          backgroundColor: "#fffbea",
          pointerEvents: "none" as const,
        }
      : {}),
    height: 48,
  } as const;

  useEffect(() => {
    setInputValue(item.value.toString()); // sync when parent updates
  }, [item.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed, 0, maxAllowed);
      onValueChange(item.id, clamped);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-muted border rounded-md mb-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex items-center">
          <GripHorizontal className="w-4 h-4 text-gray-400" />
        </span>
        <span className="text-sm">
          {item.name}{" "}
          <span className="text-xs text-gray-500">
            [{inputValue || 0}/{item.student_count} คน]
          </span>
        </span>
      </div>

      <Input
        type="number"
        min={0}
        max={maxAllowed}
        value={inputValue}
        onChange={handleChange}
        className="h-10 w-20 text-right bg-yellow-100 border-orange-300"
      />
    </div>
  );
};

/* ---------- DroppableGroup ---------- */
const DroppableGroup = ({
  children,
  groupId,
}: {
  children: React.ReactNode;
  groupId: string;
}) => {
  const { setNodeRef } = useDroppable({ id: groupId });
  return <div ref={setNodeRef}>{children}</div>;
};

/* ---------- main component ---------- */
export const GroupedFacultyInput = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [unassigned, setUnassigned] = useState<FacultyItem[]>([]);
  const allFacultiesRef = useRef<FacultyItem[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  /* ----- recalc unassigned ----- */
  const recalcUnassigned = (latest: Group[]) => {
    const allocated: Record<number, number> = {};
    latest.forEach((g) =>
      g.items.forEach((i) => {
        allocated[i.id] = (allocated[i.id] || 0) + i.value;
      })
    );

    const newUA = allFacultiesRef.current
      .map((f) => ({
        ...f,
        value: f.student_count - (allocated[f.id] || 0),
      }))
      .filter((f) => f.value > 0 || f.student_count === 0);

    setUnassigned(newUA);
  };

  const fetchData = useCallback(async () => {
    const res = await getQuotaGroups();
    if (res.status !== "success") return;

    const raw = res.data as { title: string; items: FacultyItem[] }[];

    const mapped: Group[] = raw.map((g) => ({
      round: parseRoundNo(g.title),
      title: g.title,
      items: g.items.map((it) => ({
        ...it,
        student_count: it.student_count ?? it.value,
        value: it.value,
      })),
    }));

    const ua = mapped.find((g) => g.title.includes("ยังไม่ได้จัดรอบ"));
    const assigned = mapped.filter((g) => g !== ua);

    setGroups(assigned);
    allFacultiesRef.current = uniqByIdMax([
      ...assigned.flatMap((g) => g.items),
      ...(ua?.items || []),
    ]);

    recalcUnassigned(assigned);
  }, []);

  /* ----- initial fetch ----- */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ----- change quota ----- */
  const handleValueChange = (
    id: number,
    value: number,
    scope: "group" | "unassigned",
    round?: number
  ) => {
    if (scope === "unassigned") {
      setUnassigned((prev) =>
        prev.map((it) => (it.id === id ? { ...it, value } : it))
      );
    } else if (round !== undefined) {
      setGroups((prev) => {
        const updated = prev.map((g) =>
          g.round === round
            ? {
                ...g,
                items: g.items.map((it) =>
                  it.id === id ? { ...it, value } : it
                ),
              }
            : g
        );
        recalcUnassigned(updated);
        return updated;
      });
    }
  };

  /* ----- drag end ----- */
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const [_, from, idStr] = active.id.toString().split("-");
    const to = over.id.toString();
    if (from === to) return;

    const id = +idStr;

    /* -------- หา item ต้นทางเพื่อตรวจ quota -------- */
    // let sourceItem: FacultyItem | undefined;
    // if (from === "unassigned") {
    //   sourceItem = unassigned.find((u) => u.id === id);
    // } else {
    //   const g = groups.find((gr) => gr.round === +from);
    //   sourceItem = g?.items.find((it) => it.id === id);
    // }

    const activeData = active.data?.current as {
      item: FacultyItem;
      groupId: string;
    };

    if (!activeData || !activeData.item || activeData.item.value === 0) {
      alert(`ไม่สามารถย้าย "${activeData?.item?.name ?? "รายการ"}" ยังไม่มีตน`);
      return;
    }

    const sourceItem = activeData.item;

    /* -------- เหลือ 0 → แจ้งเตือนแล้วไม่ให้ลาก -------- */
    if (!sourceItem || sourceItem.value === 0) {
      alert(`ไม่สามารถย้าย "${sourceItem?.name ?? "รายการ"}" ยังไม่มีตน`);
      return;
    }

    /* -------- ย้ายตามปกติ -------- */
    setGroups((prev) => {
      const next = [...prev];
      let moved: FacultyItem | undefined;

      // ======== PULL ออกก่อน ========
      if (from !== "unassigned") {
        const g = next.find((gr) => gr.round === +from);
        const i = g?.items.findIndex((it) => it.id === id) ?? -1;
        if (g && i >= 0) moved = g.items.splice(i, 1)[0];
      } else {
        moved = unassigned.find((u) => u.id === id);
        setUnassigned((ua) => ua.filter((u) => u.id !== id));
      }
      if (!moved) return prev;

      // ======== PUSH เข้าเป้าหมาย ========
      if (to !== "unassigned") {
        const g = next.find((gr) => gr.round === +to);
        if (!g) return prev;

        const dup = g.items.find((it) => it.id === moved!.id);
        if (dup) {
          const total = dup.value + moved!.value;
          if (total > dup.student_count) {
            alert(
              `"${dup.name}" มีอยู่แล้วในรอบนี้ และเกิน quota รวม (${total}/${dup.student_count})`
            );
            // ย้ายกลับคืน unassigned
            if (from === "unassigned") {
              setUnassigned((ua) => [...ua, moved!]);
            } else {
              const fromGroup = next.find((gr) => gr.round === +from);
              fromGroup?.items.push(moved!);
            }
            return prev;
          }
          dup.value = total; // ✅ รวมค่า
        } else {
          g.items.push(moved!);
        }
      } else {
        setUnassigned((ua) => [...ua, moved!]);
      }

      recalcUnassigned(next);
      return next;
    });
  };

  /* ----- add / remove group ----- */
  const handleAddGroup = () =>
    setGroups((prev) => {
      const nextRound = Math.max(0, ...prev.map((g) => g.round)) + 1;
      return [
        ...prev,
        { round: nextRound, title: `รอบที่ ${nextRound}`, items: [] },
      ];
    });

  const handleRemoveGroup = (round: number) =>
    setGroups((prev) => {
      const rm = prev.find((g) => g.round === round);
      if (!rm) return prev;
      setUnassigned((ua) => [...ua, ...rm.items]);
      const updated = prev.filter((g) => g.round !== round);
      recalcUnassigned(updated);
      return updated;
    });

  /* ----- save ----- */
  const handleSave = async () => {
    const payload: any = groups.map((g) => ({
      round: g.round,
      faculties: g.items.map((it) => ({
        faculty_id: it.id,
        quota: it.value,
      })),
    }));

    const res = await saveQuotaGroups(payload);

    if (res.status === "success") {
      alert("✅ บันทึกเรียบร้อย");
      await fetchData(); // <-- โหลดใหม่หลังบันทึก
    } else {
      alert("❌ บันทึกไม่สำเร็จ");
    }
  };

  /* ---------- UI ---------- */
  return (
    <Card className="bg-white shadow-xl border border-orange-100">
      <CardHeader>
        <CardTitle className="text-orange-600">ตั้งค่ารอบบัณฑิต</CardTitle>
        <p className="text-sm text-gray-500">
          * กดปุ่ม "บันทึกข้อมูล" เพื่อบันทึกโควต้าของแต่ละรอบที่จัดเสร็จแล้ว
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="pt-4 border-t mt-6 flex justify-between">
          <Button
            onClick={handleAddGroup}
            variant="outline"
            className="flex items-center gap-2 text-orange-600 border-orange-300">
            <PlusCircle className="w-5 h-5" />
            เพิ่มรอบใหม่
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg">
            บันทึกข้อมูล
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          {groups.map((g) => (
            <div key={g.round} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-orange-700">{g.title}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveGroup(g.round)}
                  className="text-red-500">
                  <Trash2 className="w-4 h-4 mr-1" />
                  ลบรอบ
                </Button>
              </div>

              <DroppableGroup groupId={g.round.toString()}>
                <SortableContext
                  items={g.items.map((i) => `draggable-${g.round}-${i.id}`)}
                  strategy={verticalListSortingStrategy}>
                  {g.items.map((it) => {
                    const other = groups
                      .filter((gr) => gr.round !== g.round)
                      .flatMap((gr) => gr.items)
                      .filter((o) => o.id === it.id)
                      .reduce((s, o) => s + o.value, 0);
                    const maxAllowed = it.student_count - other;
                    return (
                      <DraggableFaculty
                        key={`draggable-${g.round}-${it.id}`}
                        item={it}
                        groupId={g.round.toString()}
                        maxAllowed={maxAllowed}
                        onValueChange={(id, val) =>
                          handleValueChange(id, val, "group", g.round)
                        }
                      />
                    );
                  })}
                </SortableContext>
              </DroppableGroup>

              <Separator className="my-4" />
            </div>
          ))}

          <Separator className="my-6" />

          {/* unassigned */}
          <h4 className="font-semibold text-orange-700 mb-2">
            คณะที่ยังไม่ได้จัดรอบ
          </h4>
          <DroppableGroup groupId="unassigned">
            <SortableContext
              items={unassigned.map((i) => `draggable-unassigned-${i.id}`)}
              strategy={verticalListSortingStrategy}>
              {unassigned.map((it) => (
                <DraggableFaculty
                  key={`draggable-unassigned-${it.id}`}
                  item={it}
                  groupId="unassigned"
                  maxAllowed={it.value}
                  onValueChange={(id, val) =>
                    handleValueChange(id, val, "unassigned")
                  }
                />
              ))}
            </SortableContext>
          </DroppableGroup>
        </DndContext>
      </CardContent>
    </Card>
  );
};
