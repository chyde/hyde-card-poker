import clsx from "clsx";

export default function Button({
  children,
  onClick,
  pressed,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
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
        "px-3",
        "transition",
        "ease-in-out",
        "duration-500",
        pressed ? "mb-2" : "mb-16",
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
