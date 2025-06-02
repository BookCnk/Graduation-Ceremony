interface Graduate {
  name: string;
  order: number;
  faculty: string;
}

interface GraduationDisplayProps {
  graduate: Graduate;
}

export function GraduationDisplay({ graduate }: GraduationDisplayProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Current Graduate</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Name</label>
          <p className="text-2xl font-bold">{graduate.name}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Order</label>
          <p className="text-2xl font-bold">#{graduate.order}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Faculty</label>
          <p className="text-2xl font-bold">{graduate.faculty}</p>
        </div>
      </div>
    </>
  );
}
