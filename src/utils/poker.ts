export type SuitSymbol = "♥" | "♦" | "♣" | "♠";
export type SuitName = "Hearts" | "Diamonds" | "Clubs" | "Spades";

export type CardName =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "J"
  | "Q"
  | "K"
  | "A";
export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export type CardType = { name: CardName; suit: SuitSymbol };

export type Card = {
  name: CardName;
  value: CardValue;
  suit: SuitSymbol;
  suitName: SuitName;
};

export const CreateDeck = (): Array<Card> => {
  const names = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] as CardName[];
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as CardValue[];
  const suits = ["♥", "♦", "♣", "♠"] as SuitSymbol[];
  const suiteName = ["Hearts", "Diamonds", "Clubs", "Spades"] as SuitName[];

  const deck: Array<Card> = [];
  suits.forEach((s, suitIndex) => {
    names.forEach((name, cardIndex) => {
      return deck.push({
        name,
        value: values[cardIndex],
        suit: s,
        suitName: suiteName[suitIndex],
      });
    });
  });

  return deck;
};

export const ShuffleDeck = (deck: Array<Card>): Array<Card> => {
  const shuffledDeck = deck.sort(() => Math.random() - 0.5);
  return shuffledDeck;
};

export const DealHand = (deck: Array<Card>, handSize: number): Array<Card> => {
  if (handSize > deck.length) {
    throw new Error("Not enough cards in the deck");
  }

  const hand = deck.splice(0, handSize);
  return hand;
};

export const SortHand = (hand: Array<Card>): Array<Card> => {
  const sortedHand = hand.map((a) => a).sort((a, b) => a.value - b.value);
  return sortedHand;
};

type HandEvaluation = {
  playerName: string;
  name: string;
  description: string;
  orderedEval: Array<number>;
};

// Royal flush <0.001%
// 1 Straight flush (not including royal flush) <0.002%
// 2 Four of a kind 0.02%
// 3 Full house 0.14%
// 4 Flush (excluding royal flush and straight flush) 0.20%
// 5 Straight (excluding royal flush and straight flush) 0.39%
// 6 Three of a kind 2.11%
// 7 Two pair 4.75%
// 8 One pair 42.30%
// 9 No pair / High card 50.10%

export const EvaluateHand = (
  hand: Array<Card>,
  playerName: string
): HandEvaluation => {
  const sortedHand = SortHand(hand);

  const isFlush = sortedHand.every((card, _, array) => {
    return card.suit === array[0].suit;
  });

  const isStraight = sortedHand.every((card, index, array) => {
    if (index === 0) {
      return true;
    }

    return card.value === array[index - 1].value + 1;
  });

  if (isFlush && isStraight) {
    return {
      playerName: playerName,
      name: "Straight Flush",
      description: `${hand[4].name}${hand[4].suit} high straight flush`,
      orderedEval: [1, hand[4].value],
    };
  }

  if (isFlush) {
    return {
      playerName: playerName,
      name: "Flush",
      description: `${hand[4].name}${hand[4].suit} high flush`,
      orderedEval: [4, hand[4].value],
    };
  }

  if (isStraight) {
    return {
      playerName: playerName,
      name: "Straight",
      description: `${hand[4].name} high straight`,
      orderedEval: [5, hand[4].value],
    };
  }

  const pairs = new Map<CardValue, Array<Card>>();
  sortedHand.forEach((card) => {
    if (pairs.has(card.value)) {
      const cards = pairs.get(card.value) as Array<Card>;
      cards.push(card);
      pairs.set(card.value, cards);
    } else {
      pairs.set(card.value, [card]);
    }
  });

  const pairValues = Array.from(pairs.keys()).sort((a, b) => b - a);

  if (pairs.size === 2) {
    // 4 of a kind
    pairValues.forEach((value) => {
      const matchedCards = pairs.get(value) as Array<Card>;

      if (matchedCards.length === 4) {
        return {
          playerName: playerName,
          name: "Four of a Kind",
          description: `${matchedCards[0].name}s`,
          orderedEval: [2, value],
        };
      }
    });

    // Full House
    const firstSet = pairs.get(pairValues[0]) as Array<Card>;
    const secondSet = pairs.get(pairValues[1]) as Array<Card>;
    if (firstSet.length === 3) {
      return {
        playerName: playerName,
        name: "Full House",
        description: `${firstSet[0].name}s full of ${secondSet[0].name}s`,
        orderedEval: [3, firstSet[0].value, secondSet[0].value],
      };
    } else if (secondSet.length === 3) {
      return {
        playerName: playerName,
        name: "Full House",
        description: `${secondSet[0].name}s full of ${firstSet[0].name}s`,
        orderedEval: [3, secondSet[0].value, firstSet[0].value],
      };
    }
  }

  if (pairs.size === 3 || pairs.size === 4) {
    // 3 of a kind, Two Pair or One Pair

    const pairCardsOrdered: Array<Card> = [];
    let leftover: Card | undefined;

    pairValues.reverse().forEach((value) => {
      const matchedCards = pairs.get(value) as Array<Card>;

      if (matchedCards.length === 3) {
        return {
          playerName: playerName,
          name: "Three of a Kind",
          description: `${matchedCards[0].name}s`,
          orderedEval: [6, value],
        };
      }
      if (matchedCards.length === 2) {
        pairCardsOrdered.push(matchedCards[0]);
      }
      if (matchedCards.length === 1) {
        if (!leftover) {
          leftover = matchedCards[0];
        }
      }
    });

    if (pairCardsOrdered.length === 1) {
      return {
        playerName: playerName,
        name: "One Pair",
        description: `${pairCardsOrdered[0]?.name}s`,
        orderedEval: [
          8,
          pairCardsOrdered[0]?.value,
          leftover ? leftover.value : 0,
        ],
      };
    }
    return {
      playerName: playerName,
      name: "Two Pair",
      description: `${pairCardsOrdered[0]?.name}s and ${pairCardsOrdered[1]?.name}s`,
      orderedEval: [
        7,
        pairCardsOrdered[0]?.value,
        pairCardsOrdered[1]?.value,
        leftover ? leftover.value : 0,
      ],
    };
  }

  return {
    playerName: playerName,
    name: "High Card",
    description: `${sortedHand[4]?.name} high`,
    orderedEval: [10, ...sortedHand.reverse().map((card) => card.value)],
  };
};
