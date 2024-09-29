import clsx from "clsx";

export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx(
        "bold",
        "inline-flex",
        "h-12",
        "items-center",
        "justify-center",
        "rounded-md",
        "bg-amber-500/50",
        "border-2",
        "border-yellow-500",
        "px-6",
        "mb-2",
        "font-medium",
        "text-neutral-50",
        "shadow-lg",
        "shadow-neutral-500/20",
        "transition",
        "active:scale-95"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
