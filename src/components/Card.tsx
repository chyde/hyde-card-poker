import clsx from "clsx";
import { CardType } from "../utils/poker";

export function Card({
  card,
  faceUp,
  keeping,
}: {
  card: CardType;
  faceUp: boolean;
  keeping: boolean;
}) {
  return (
    <div
      className={clsx(
        "ease-in-out duration-500 transform",
        "w-[100px] mw-[100px] h-[140px] rounded relative text-xl",
        keeping ? "" : "opacity-50",
        faceUp
          ? "bg-slate-50 border border-slate-200"
          : "border-4 bg-slate-100 border-slate-100"
      )}
    >
      {faceUp ? (
        <div
          className={clsx(
            "p-2 font-bold ",
            card.suit === "♦" || card.suit === "♥"
              ? "text-red-600"
              : "text-black"
          )}
        >
          <div>
            <div>{card.name}</div>
            <div>{card.suit}</div>
          </div>
          <div className="absolute bottom-0 right-0 m-1 p-2 rotate-180">
            <div>{card.name}</div>
            <div>{card.suit}</div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full card-bg rounded m-0 p-0  border"></div>
      )}
    </div>
  );
}
