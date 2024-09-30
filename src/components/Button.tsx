import clsx from "clsx";

export default function Button({
  children,
  onClick,
  // pressed,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "bold",
        "inline-flex",
        "h-12",
        "items-center",
        "justify-center",
        "rounded-md",

        "border-2",
        "border-yellow-500",
        "px-3",
        "transition",
        "ease-in-out",
        "duration-500",
        "font-medium",
        "text-neutral-50",
        disabled
          ? "bg-gray-900/50 text-gray-900 border-gray-800"
          : "bg-amber-500/50",
        "shadow-lg",
        "transition",
        "active:scale-95"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
