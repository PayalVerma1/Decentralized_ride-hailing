/**
 * SkeletonLoader – Shimmer placeholder for loading states.
 *
 * Variants:
 *   text        – Lines of text
 *   circular    – Avatar / icon placeholder
 *   rectangular – Image / map placeholder
 *   card        – Full card skeleton
 *   stat        – Dashboard stat card
 *   table-row   – Single table row
 */
export default function SkeletonLoader({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
}) {
  const base = "skeleton-shimmer rounded-lg";

  if (variant === "circular") {
    return (
      <div
        className={`${base} rounded-full shrink-0 ${className}`}
        style={{ width: width || 48, height: height || 48 }}
      />
    );
  }

  if (variant === "rectangular") {
    return (
      <div
        className={`${base} rounded-xl ${className}`}
        style={{ width, height: height || 120 }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`glass rounded-2xl p-5 space-y-4 ${className}`}
        style={{ width, height }}
      >
        <div className={`${base} h-4 w-1/3`} />
        <div className={`${base} h-8 w-2/3`} />
        <div className={`${base} h-3 w-full`} />
        <div className={`${base} h-3 w-4/5`} />
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={`glass rounded-2xl p-5 space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className={`${base} w-10 h-10 rounded-xl`} />
          <div className={`${base} w-12 h-4 rounded-md`} />
        </div>
        <div className={`${base} h-7 w-24`} />
        <div className={`${base} h-3 w-32`} />
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={`flex items-center gap-4 p-4 ${className}`}>
        <div className={`${base} w-10 h-10 rounded-xl shrink-0`} />
        <div className="flex-1 space-y-2">
          <div className={`${base} h-3.5 w-2/5`} />
          <div className={`${base} h-3 w-3/5`} />
        </div>
        <div className={`${base} w-16 h-5 rounded-md`} />
      </div>
    );
  }

  // text variant
  return (
    <div className={`space-y-2.5 ${className}`} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${base} h-3.5`}
          style={{ width: i === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  );
}
