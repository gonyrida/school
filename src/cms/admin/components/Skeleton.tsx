interface Props {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: Props) {
  return <div className={`animate-pulse rounded-lg bg-ink-200/40 ${className}`} />;
}

export function SkeletonStack({ count = 3, className = 'h-16' }: Props) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}
