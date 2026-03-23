type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function EmptyState({
  title = "No data found",
  description = "Try adjusting your filters or date range to see available records.",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-30 bg-white p-6 ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-10" />
        <div className="text-base font-semibold text-gray-80">{title}</div>
        <div className="mt-1 text-sm text-gray-60">{description}</div>
      </div>
    </div>
  );
}
