import { useEffect, useState } from "react";
import { getQuotaGroups } from "@/services/graduatesService";
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

interface FacultyItem {
  id: number;
  name: string;
  value: number;
  student_count: number;
}

interface Group {
  title: string;
  items: FacultyItem[];
}

const DraggableFaculty = ({
  item,
  groupId,
  onValueChange,
}: {
  item: FacultyItem;
  groupId: string;
  onValueChange: (id: number, value: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${groupId}-${item.id}`,
    data: { item, groupId },
  });

  // Utility: remove scale from transform string
  const stripScale = (transformStr: string) =>
    transformStr.replace(/scale[XY]?\([^)]+\)/g, "");

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
      : {
          zIndex: "auto",
          pointerEvents: "auto" as const,
        }),
    height: "48px",
    width: "100%",
    boxSizing: "border-box" as const,
    lineHeight: "1.5rem",
    transition: "none",
  } as const;

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    onValueChange(item.id, value);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-muted rounded-md border border-gray-200 mb-2 shadow-sm">
      <div className="flex items-center space-x-2">
        <GripHorizontal className="w-4 h-4 text-gray-400" />
        <span className="text-sm">
          {item.name}
          {item.student_count > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({item.student_count} คน)
            </span>
          )}
        </span>
      </div>
      <Input
        type="number"
        value={item.value}
        onChange={handleValueChange}
        min="0"
        className="h-10 rounded-md border px-3 py-2 text-base border-orange-300 text-black w-20 text-right bg-yellow-100"
      />
    </div>
  );
};

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

export const GroupedFacultyInput = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [unassigned, setUnassigned] = useState<FacultyItem[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    getQuotaGroups().then((res) => {
      if (res.status === "success") {
        const fetchedGroups: Group[] = res.data;
        const unassignedGroup = fetchedGroups.find((g) =>
          g.title.includes("ยังไม่ได้จัดรอบ")
        );
        const assignedGroups = fetchedGroups.filter(
          (g) => g.title !== unassignedGroup?.title
        );

        setGroups(assignedGroups);
        setUnassigned(unassignedGroup?.items || []);
      }
    });
  }, []);

  const handleValueChange = (id: number, value: number) => {
    setUnassigned((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );

    setGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === id ? { ...item, value } : item
        ),
      }))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [_, fromGroupId, itemIdStr] = active.id.toString().split("-");
    const toGroupId = over.id.toString();
    const itemId = parseInt(itemIdStr);

    if (fromGroupId === toGroupId) return;

    let movedItem: FacultyItem | undefined;

    const getSourceGroup = (groupId: string) =>
      groupId === "unassigned" ? unassigned : groups[parseInt(groupId)].items;

    movedItem = getSourceGroup(fromGroupId).find((item) => item.id === itemId);
    if (!movedItem) return;

    // 🔄 Remove item from all places
    setUnassigned((prev) => prev.filter((i) => i.id !== itemId));
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.filter((i) => i.id !== itemId),
      }))
    );

    if (toGroupId === "unassigned") {
      setUnassigned((prev) => [...prev, movedItem!]);
    } else {
      const index = parseInt(toGroupId);
      setGroups((prev) => {
        const updated = [...prev];
        updated[index].items.push(movedItem!);
        return updated;
      });
    }
  };

  const handleAddGroup = () => {
    setGroups((prev) => {
      const newGroup = { title: `รอบที่ ${prev.length + 1}`, items: [] };
      return [...prev, newGroup];
    });
  };

  const handleSaveData = async () => {
    // const payload = groups.map((group, index) => ({
    //   round_number: index + 1,
    //   faculties: group.items.map((item) => ({
    //     id: item.id,
    //     quota: item.value,
    //   })),
    // }));
    // try {
    //   const response = await fetch("/api/save-quota-groups", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });
    //   const result = await response.json();
    //   if (result.status === "success") {
    //     alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
    //   } else {
    //     alert("❌ บันทึกไม่สำเร็จ");
    //   }
    // } catch (error) {
    //   console.error("❌ Save error:", error);
    //   alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    // }
  };

  const handleRemoveGroup = (index: number) => {
    const removedItems = groups[index].items;
    setUnassigned((prev) => [...prev, ...removedItems]);
    setGroups((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((g, i) => ({ ...g, title: `รอบที่ ${i + 1}` }));
    });
  };

  return (
    <Card className="bg-white shadow-xl border border-orange-100">
      <CardHeader>
        <CardTitle className="text-orange-600">ตั้งค่ารอบบัณฑิต</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="pt-4 border-t mt-6 flex justify-between">
          <Button
            onClick={handleAddGroup}
            variant="outline"
            className="flex items-center gap-2 text-orange-600 border-orange-300 hover:text-orange-700">
            <PlusCircle className="w-5 h-5" />
            เพิ่มรอบใหม่
          </Button>
          <Button
            onClick={handleSaveData}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
            บันทึกข้อมูล
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          {groups.map((group, index) => (
            <div key={`group-${index}`} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-orange-700">{group.title}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveGroup(index)}
                  className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4 mr-1" />
                  ลบรอบ
                </Button>
              </div>
              <DroppableGroup groupId={index.toString()}>
                <SortableContext
                  items={group.items.map((i) => `draggable-${index}-${i.id}`)}
                  strategy={verticalListSortingStrategy}>
                  {group.items.length > 0 ? (
                    group.items.map((item) => (
                      <DraggableFaculty
                        key={`draggable-${index}-${item.id}`}
                        item={item}
                        groupId={index.toString()}
                        onValueChange={handleValueChange}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      ไม่มีคณะในรอบนี้
                    </p>
                  )}
                </SortableContext>
              </DroppableGroup>
              {index < groups.length - 1 && <Separator className="my-4" />}
            </div>
          ))}

          <Separator className="my-6" />

          <div>
            <h4 className="font-semibold text-orange-700 mb-2">
              คณะที่ยังไม่ได้จัดรอบ
            </h4>
            <DroppableGroup groupId="unassigned">
              <SortableContext
                items={unassigned.map((i) => `draggable-unassigned-${i.id}`)}
                strategy={verticalListSortingStrategy}>
                {unassigned.map((item) => (
                  <DraggableFaculty
                    key={`draggable-unassigned-${item.id}`}
                    item={item}
                    groupId="unassigned"
                    onValueChange={handleValueChange}
                  />
                ))}
              </SortableContext>
            </DroppableGroup>
          </div>
        </DndContext>
      </CardContent>
    </Card>
  );
};
