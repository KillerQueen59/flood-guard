type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function LoadingState({
  title = "Loading data",
  description = "Please wait while we fetch the latest records.",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex min-h-[220px] items-center justify-center rounded-xl border border-gray-20 bg-gradient-to-br from-slate-50 to-blue-50 p-6 ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <div className="text-base font-semibold text-gray-80">{title}</div>
        <div className="mt-1 text-sm text-gray-60">{description}</div>
      </div>
    </div>
  );
}
