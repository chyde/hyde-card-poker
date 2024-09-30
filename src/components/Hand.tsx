import { useState } from "react";
import clsx from "clsx";
import { Card } from "./Card";
import { Card as CardT, EvaluateHand } from "../utils/poker";
import Button from "./Button";

export function Hand({
  hand,
  isCPU = true,
  playerName = "",
  revealed = false,
}: {
  hand: Array<CardT>;
  isCPU?: boolean;
  playerName?: string;
  revealed?: boolean;
}) {
  const [keepingIndices, setKeepingIndices] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  const handType = EvaluateHand(hand);

  return (
    <div className="container sm:container mx-auto">
      <div className="flex flex-wrap gap-2 p-4 text-white border border-white mb-1 rounded-lg">
        <div className="w-36">
          {!isCPU || revealed ? (
            <div className="py-2">{handType.toString()}</div>
          ) : null}
          {!isCPU ? (
            <button className="outline rounded-lg p-2 hover:bg-white/25 active:bg-white/75">
              Click me
            </button>
          ) : null}
        </div>
        {hand.map((card, cardIndex) => {
          return (
            <div key={`player-card-${cardIndex}`} className="grow flex">
              <div className="mx-auto ">
                <div
                  className={clsx("flex justify-center", isCPU ? "hidden" : "")}
                >
                  <Button
                    onClick={() => {
                      setKeepingIndices((prev) => {
                        const newKeepingIndices = [...prev];
                        newKeepingIndices[cardIndex] = !prev[cardIndex];
                        return newKeepingIndices;
                      });
                    }}
                    pressed={!keepingIndices[cardIndex]}
                  >
                    {keepingIndices[cardIndex] ? "Discard" : "Keep"}
                  </Button>
                </div>
                <Card
                  key={cardIndex}
                  card={card}
                  faceUp={revealed}
                  keeping={keepingIndices[cardIndex]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
