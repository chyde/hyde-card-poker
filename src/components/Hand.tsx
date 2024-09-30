import { useState, useMemo } from "react";
import clsx from "clsx";
import { Card } from "./Card";
import { Card as CardT, EvaluateHand } from "../utils/poker";
import Button from "./Button";
import { useGameState } from "@/providers/GameStateProvider";

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

  const handType = useMemo(() => {
    if (hand && hand.length === 5) {
      return EvaluateHand(hand, playerName);
    }
  }, [hand]);

  const { tradeSelectedCards, restartGame, gameOver, winner } = useGameState();

  return (
    <div className="container sm:container mx-auto">
      <div className="flex flex-wrap gap-2 p-4 text-white border border-white mb-1 mt-1 rounded-lg">
        <div className="w-36">
          {!isCPU || revealed ? (
            <>
              <div className="pb-2">{handType?.name}</div>
              <div className="pb-2">{handType?.description}</div>
            </>
          ) : null}
          {!isCPU ? (
            <>
              <button
                className="outline rounded-lg p-2 hover:bg-white/25 active:bg-white/75"
                onClick={() => {
                  if (gameOver) {
                    restartGame();
                  } else {
                    tradeSelectedCards(keepingIndices.map((k) => k));
                    setKeepingIndices([true, true, true, true, true]);
                  }
                }}
              >
                {gameOver ? "New Game" : "Trade"}
              </button>
              <div className="py-2">
                {winner ? `${winner} Wins!` : null} {winner}
              </div>
            </>
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
                    disabled={gameOver}
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
