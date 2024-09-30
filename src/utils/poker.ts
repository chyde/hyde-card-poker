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
  const sortedHand = hand.sort((a, b) => a.value - b.value);
  return sortedHand;
};

export const EvaluateHand = (hand: Array<Card>): string => {
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
    return "Straight Flush";
  }

  if (isFlush) {
    return "Flush";
  }

  if (isStraight) {
    return "Straight";
  }

  const pairs = new Map<CardValue, number>();
  sortedHand.forEach((card) => {
    if (pairs.has(card.value)) {
      pairs.set(card.value, pairs.get(card.value) ?? 0 + 1);
    } else {
      pairs.set(card.value, 1);
    }
  });

  if (pairs.size === 2) {
    return "Full House";
  }

  if (pairs.size === 3) {
    return "Two Pair";
  }

  if (pairs.size === 4) {
    return "One Pair";
  }

  return "High Card";
};
