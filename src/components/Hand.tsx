// import clsx from "clsx";
import { Card } from "./Card";
import { Card as CardT, EvaluateHand } from "../utils/poker";

export function Hand({
  hand,
  revealed = false,
}: {
  hand: Array<CardT>;
  revealed?: boolean;
}) {
  const handType = EvaluateHand(hand);
  return (
    <div className="container sm:container mx-auto">
      <div className="flex flex-wrap gap-2 p-6 text-white border border-white mb-1 ">
        {hand.map((card, index) => {
          return (
            <Card key={index} card={card} faceUp={revealed} keeping={true} />
          );
        })}
      </div>
    </div>
  );
}
