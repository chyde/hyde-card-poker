"use client";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
} from "react";

import {
  CreateDeck,
  ShuffleDeck,
  DealHand,
  // SortHand,
  EvaluateHand,
  Card,
} from "../utils/poker";

const GameStateContext = createContext<{
  gameDeck: Card[];
  myHand: Card[];
  otherPlayersHands: Card[][];
  isShuffled: boolean;
  gameOver: boolean;
  winner: string | null;
  OTHER_PLAYERS_COUNT: number;
  tradeSelectedCards: (keepingIndices: Array<boolean>) => void;
  restartGame: () => void;
}>({
  gameDeck: [],
  myHand: [],
  otherPlayersHands: [],
  isShuffled: false,
  gameOver: false,
  winner: null,
  OTHER_PLAYERS_COUNT: 0,
  tradeSelectedCards: () => void 0,
  restartGame: () => void 0,
});

export default function GameStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const OTHER_PLAYERS_COUNT = 3;
  const [isShuffled, setIsShuffled] = useState(false);

  const [gameDeck, setGameDeck] = useState<Card[]>([]);

  const [myHand, setMyHand] = useState<Card[]>([]);
  const [otherPlayersHands, setOtherPlayersHands] = useState<Array<Card[]>>([]);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  const tradeSelectedCards = useCallback(
    (keepingIndices: Array<boolean>) => {
      if (gameOver) {
        return;
      }
      setGameDeck((previousDeck) => {
        setMyHand((prevHand) => {
          const newHand = prevHand.map((card, index) => {
            if (keepingIndices[index]) {
              return card;
            }
            const topCard = previousDeck.shift() as Card;
            return topCard;
          });
          return newHand;
        });
        determineWinner();
        setGameOver(true);
        return previousDeck;
      });
    },
    [gameOver, isShuffled]
  );

  const determineWinner = () => {
    const myHandEval = EvaluateHand(myHand, "Player");
    const otherPlayersHandsEval = otherPlayersHands.map((hand, cpuIndex) =>
      EvaluateHand(hand, `CPU ${cpuIndex + 1}`)
    );

    const allHandsEval = [...otherPlayersHandsEval, myHandEval];

    const winningHands = allHandsEval.sort((handA, handB) => {
      // TODO: Implement deeper tie-breaker
      if (handA.orderedEval[0] == handB.orderedEval[0]) {
        return handB.orderedEval[1] - handA.orderedEval[1];
      }
      return handA.orderedEval[0] - handB.orderedEval[0];
    });
    setWinner(winningHands[0].playerName);
  };

  const restartGame = () => {
    setWinner(null);
    setIsShuffled(false);
    setGameOver(false);
  };

  useEffect(() => {
    if (isShuffled) {
      return;
    }
    setIsShuffled(true);

    const deck = ShuffleDeck(CreateDeck());
    const myHand = DealHand(deck, 5);
    setMyHand(myHand);

    setOtherPlayersHands(
      Array.from({ length: OTHER_PLAYERS_COUNT }, () => {
        return DealHand(deck, 5);
      })
    );

    setGameDeck(() => {
      return deck;
    });
  }, [isShuffled]);

  return (
    <GameStateContext.Provider
      value={{
        gameDeck,
        myHand,
        otherPlayersHands,
        isShuffled,
        gameOver,
        winner,
        OTHER_PLAYERS_COUNT,
        tradeSelectedCards,
        restartGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
