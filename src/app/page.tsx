"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Hand } from "../components/Hand";

import {
  CreateDeck,
  ShuffleDeck,
  DealHand,
  SortHand,
  EvaluateHand,
  Card,
} from "../utils/poker";

import { useGameState } from "@/providers/GameStateProvider";

export default function Home() {
  const { myHand, otherPlayersHands, gameOver } = useGameState();

  return (
    <div className="bg-green-700">
      <div key="all-hands" className="flex flex-col justify-evenly">
        {otherPlayersHands?.map((hand, index) => {
          return (
            <Hand
              key={`player-${index}`}
              hand={hand}
              revealed={gameOver}
              isCPU={true}
            />
          );
        })}
        <Hand hand={myHand} revealed={true} isCPU={false} />
      </div>
    </div>
  );
}
