import { matches } from "../ws";
import type { Player, Match } from "~/types/websocket";

// Initialisiere die Statistik-Objekte, falls nicht vorhanden
function ensureStatsInitialized(player: Player) {
    if (!player.stats) {
        player.stats = {
            average: 0,
            first9Average: 0,
            first9Points: 0,
            first9DartsThrown: 0, // Neu für First 9 Score-Tracking
            checkoutPercentage: 0,
            checkouts: 0,
            checkoutsAttemps: 0,
            allPoints: 0,
            score180: 0,
            score140: 0,
            score100: 0,
            score60: 0
        };
    }
    
    // Stelle sicher, dass alle Felder existieren
    if (player.stats.score180 === undefined) player.stats.score180 = 0;
    if (player.stats.score140 === undefined) player.stats.score140 = 0;
    if (player.stats.score100 === undefined) player.stats.score100 = 0;
    if (player.stats.score60 === undefined) player.stats.score60 = 0;
    if (player.stats.first9Points === undefined) player.stats.first9Points = 0;
}

// Aktualisiere die Statistiken eines Spielers
export function handleMatchStats(player: Player, match: Match) {
    ensureStatsInitialized(player);
    
    // Berechne Overall Average korrekt
    const totalDartsThrown = getTotalDartsThrown(player, match);
    
    if (totalDartsThrown > 0) {
        // Berechne Overall Average mit 1 Dezimalstelle
        player.stats.average = Math.round((player.stats.allPoints / totalDartsThrown *3 ) * 10) / 10;
        
        // First 9 Average nur für die ersten 9 geworfenen Darts
        // Verwende first9Points direkt
        if (player.stats.first9Points && player.stats.first9Points > 0) {
            // Berechne, wie viele der ersten 9 Darts geworfen wurden
            
            player.stats.first9Average = Math.round((player.stats.first9Points / player.stats.first9DartsThrown )* 3  * 10) / 10;
        }
    }
    
    // Berechne Checkout Percentage mit 1 Dezimalstelle
    if (player.stats.checkoutsAttemps > 0) {
        player.stats.checkoutPercentage = Math.round((player.stats.checkouts / player.stats.checkoutsAttemps) * 100 * 10) / 10;
    }
}

// Hilfsfunktion, um die Gesamtzahl der geworfenen Darts zu berechnen
function getTotalDartsThrown(player: Player, match: Match): number {
    if (!player.scores.legDartsCount) {
        return 0;
    }
    
    // Zähle die Darts aller Legs des aktuellen Spiels
    return Object.values(player.scores.legDartsCount).reduce((sum, count) => sum + count, 0);
}

// Neue Funktion zum Tracken eines einzelnen Wurfes
export function trackScore(player: Player, score: number, match: Match) {
    ensureStatsInitialized(player);
    
    // Zähle den Score zu allPoints
    player.stats.allPoints += score;
    
    // First9Points werden jetzt direkt in handleDartThrow erhöht,
    // da wir dort den genauen Count der Darts im Leg haben
}

// Neue Funktion zum Tracken eines kompletten 3-Dart-Wurfes
export function trackRoundScore(player: Player, roundScore: number) {
    ensureStatsInitialized(player);
    
    // Tracking basierend auf dem Rundenscore (3 Darts)
    if (roundScore === 180) {
        player.stats.score180 += 1;
    } else if (roundScore >= 140 && roundScore < 180) {
        player.stats.score140 += 1;
    } else if (roundScore >= 100 && roundScore < 140) {
        player.stats.score100 += 1;
    } else if (roundScore >= 60 && roundScore < 100) {
        player.stats.score60 += 1;
    }
}

// Neue Funktion zum Tracken von Checkouts
export function trackCheckoutAttempt(player: Player, isSuccessful: boolean) {
    ensureStatsInitialized(player);
    
    player.stats.checkoutsAttemps++;
    if (isSuccessful) {
        player.stats.checkouts++;
       
    }
    
    // Aktualisiere gleich die Prozentangabe
    player.stats.checkoutPercentage = Math.round((player.stats.checkouts / player.stats.checkoutsAttemps) * 100 * 10) / 10;
}




