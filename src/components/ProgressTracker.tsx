interface Progress {
  total: number;
  called: number;
  remaining: number;
}

interface ProgressTrackerProps {
  progress: Progress;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const percentage = Math.round((progress.called / progress.total) * 100);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Ceremony Progress</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.called}</p>
            <p className="text-sm text-muted-foreground">Called</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{progress.remaining}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
        </div>
      </div>
    </>
  );
}
