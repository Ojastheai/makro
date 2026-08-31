export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6 animate-pulse pb-20">
      <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
      
      <div className="bg-card p-4 rounded-xl border border-border h-48"></div>
      
      <div className="space-y-4 pt-4">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="h-20 bg-card border border-border rounded-lg"></div>
        <div className="h-20 bg-card border border-border rounded-lg"></div>
      </div>
    </div>
  );
}
