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

export default function Home() {
  const OTHER_PLAYERS = 3;
  const [isShuffled, setIsShuffled] = useState(false);

  const [gameDeck, setGameDeck] = useState<Card[]>([]);

  const [myHand, setMyHand] = useState<Card[]>([]);
  const [otherPlayersHands, setOtherPlayersHands] = useState<Array<Card[]>>([]);

  useEffect(() => {
    if (isShuffled) {
      return;
    }
    setIsShuffled(true);

    const deck = ShuffleDeck(CreateDeck());
    const myHand = DealHand(deck, 5);
    setMyHand(myHand);

    setOtherPlayersHands(
      Array.from({ length: OTHER_PLAYERS }, () => {
        return DealHand(deck, 5);
      })
    );

    setGameDeck(() => {
      return deck;
    });
  }, [isShuffled]);

  return (
    <div className="bg-green-700">
      <div key="all-hands" className="flex flex-col justify-evenly">
        {otherPlayersHands?.map((hand, index) => {
          return <Hand key={`player-${index}`} hand={hand} revealed={false} />;
        })}
        <Hand hand={myHand} revealed={true} />
      </div>
    </div>
  );
}
