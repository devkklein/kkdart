import { matches } from "../ws";
import {
  endLeg,
  endSet,
  mapPlayer,
  switchplayers,
  updateScore,
} from "../utils";

import { Match, Player, Sockets } from "~/types/websocket";
import { trackCheckoutAttempt } from "./matchStats";

export function handleX01Match(
  match: Match,
  sockets: Sockets,
  matchId: string,
  currentPlayer: Player,
  score: number,
  multiplier: number
) {
  try {
    if (match && !match.finished) {
      const points = score * multiplier;
      const newScore = currentPlayer.scores.currentScore - points;

      // Add debug marker for checkout attempt checking
      const isCheckoutAttempt = isCheckoutAttemptDart(
        currentPlayer.scores.currentScore,
        match.settings.outMode
      );

      if (newScore < 0) {
        currentPlayer.scores.currentScore =
          currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
        currentPlayer.scores.legScores[match.currentLeg].roundScores[
          match.currentRound
        ] = {
          scores: [],
        };
        mapPlayer(match, currentPlayer);
        if (currentPlayer.scores.thrownDarts < 3) {
          switchplayers(match, sockets, currentPlayer);
        }
      } else if (
        (newScore === 1 && match.settings.outMode === "Double") ||
        match.settings.outMode === "Master"
      ) {
        updateScore(currentPlayer, points, match, score, multiplier);
        currentPlayer.scores.currentScore =
          currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
        currentPlayer.scores.legScores[match.currentLeg].roundScores[
          match.currentRound
        ] = {
          scores: [],
        };
        mapPlayer(match, currentPlayer);
        if (currentPlayer.scores.thrownDarts < 3) {
          switchplayers(match, sockets, currentPlayer);
        }
      } else if (newScore === 0) {
        if (match.settings.outMode === "Double") {
          if (multiplier === 2) {
            trackCheckoutAttempt(currentPlayer, true);
            updateScore(currentPlayer, points, match, score, multiplier);
            endLeg(match, currentPlayer, sockets);
          } else {
            currentPlayer.scores.currentScore =
              currentPlayer.scores.currentScore +
              currentPlayer.scores.roundScore;
            currentPlayer.scores.legScores[match.currentLeg].roundScores[
              match.currentRound
            ] = {
              scores: [],
            };
            mapPlayer(match, currentPlayer);
            if (currentPlayer.scores.thrownDarts < 3) {
              switchplayers(match, sockets, currentPlayer);
            }
          }
        } else if (match.settings.outMode === "Master") {
          if (multiplier === 2 || multiplier === 3) {
            trackCheckoutAttempt(currentPlayer, true);
            updateScore(currentPlayer, points, match, score, multiplier);
            endLeg(match, currentPlayer, sockets);
          }
        } else {
          trackCheckoutAttempt(currentPlayer, true);
          updateScore(currentPlayer, points, match, score, multiplier);
          endLeg(match, currentPlayer, sockets);
        }
      } else {
        if (isCheckoutAttempt) {
          trackCheckoutAttempt(currentPlayer, false);
        }
        updateScore(currentPlayer, points, match, score, multiplier);
        mapPlayer(match, currentPlayer);
      }
    }
  } catch (err) {
    console.error("Error during game", err);
  }
}

// Hilfsfunktionen für Checkout-Tracking
function isCheckoutAttemptDart(currentScore: number, outMode: string): boolean {
  if (outMode === "Singel") {
    return currentScore <= 40; // Für Single-Out: Jeder Wert unter 40 ist ein möglicher Checkout
  } else if (outMode === "Double") {
    return (
      currentScore <= 40 && (currentScore % 2 === 0 || currentScore === 50)
    ); // Für Double-Out: gerade Zahlen oder Bullseye
  } else if (outMode === "Master") {
    // Für Master-Out (Triple oder Double): Prüfe, ob ein möglicher Checkout mit D oder T existiert
    return currentScore <= 60; // Vereinfacht - kann erweitert werden, um zu prüfen, ob der Score mit D oder T erreicht werden kann
  }
  return false;
}

function isValidOutshot(multiplier: number, outMode: string): boolean {
  if (outMode === "Singel") {
    return true; // Jeder Treffer ist gültig
  } else if (outMode === "Double") {
    return multiplier === 2; // Nur Double ist gültig
  } else if (outMode === "Master") {
    return multiplier === 2 || multiplier === 3; // Double oder Triple ist gültig
  }
  return false;
}
