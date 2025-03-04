import type { DartThrow } from '~/types/offline'

export class DartBot {

  private targetAccuracy: number = 0
  private consistencyFactor: number = 0
  private difficultyLevel: number
  private difficultyName: string
  private t20SuccessRate: number = 1.0
  private t20AttemptCount: number = 0
  private t20SuccessCount: number = 0
  private currentPreferredTarget: number = 20 // Start with T20
  
  /**
   * Create a bot by difficulty level (1-10)
   * @param level The difficulty level (1-10)
   * @returns A configured DartBot instance
   */
  static createByLevel(level: number): DartBot {
    const clampedLevel = Math.max(1, Math.min(10, Math.floor(level)));
    
    switch(clampedLevel) {
      case 1: return new DartBot(25, "Anfänger", 1);
      case 2: return new DartBot(30, "Neuling", 2);
      case 3: return new DartBot(36, "Hobby", 3);
      case 4: return new DartBot(42, "Amateur", 4);
      case 5: return new DartBot(50, "Vereinsspieler", 5);
      case 6: return new DartBot(56, "Fortgeschritten", 6);
      case 7: return new DartBot(62, "Ligaspieler", 7);
      case 8: return new DartBot(75, "Profi", 8);
      case 9: return new DartBot(87, "Meister", 9);
      case 10: return new DartBot(100, "Weltklasse", 10);
      default: return new DartBot(50, "Vereinsspieler", 5);
    }
  }
  
  /**
   * Private constructor - use DartBot.createByLevel() instead
   * @param averagePerThreeDarts The target 3-dart average
   * @param name The difficulty name
   * @param level The difficulty level (1-10)
   */
  private constructor(averagePerThreeDarts: number, name: string, level: number) {
    this.targetAverage = averagePerThreeDarts;
    this.difficultyName = name;
    this.difficultyLevel = level;
    
    // Configure accuracy based on level rather than average for more control
    switch(level) {
      case 1: // Anfänger (25 avg)
        this.targetAccuracy = 0.15;
        this.consistencyFactor = 0.05;
        break;
      case 2: // Neuling (30 avg)
        this.targetAccuracy = 0.20;
        this.consistencyFactor = 0.10;
        break;
      case 3: // Hobby (36 avg)
        this.targetAccuracy = 0.25;
        this.consistencyFactor = 0.15;
        break;
      case 4: // Amateur (42 avg)
        this.targetAccuracy = 0.30;
        this.consistencyFactor = 0.20;
        break;
      case 5: // Vereinsspieler (50 avg)
        this.targetAccuracy = 0.38;
        this.consistencyFactor = 0.30;
        break;
      case 6: // Fortgeschritten (56 avg)
        this.targetAccuracy = 0.45;
        this.consistencyFactor = 0.35;
        break;
      case 7: // Ligaspieler (62 avg)
        this.targetAccuracy = 0.52;
        this.consistencyFactor = 0.42;
        break;
      case 8: // Profi (75 avg)
        this.targetAccuracy = 0.60;
        this.consistencyFactor = 0.55;
        break;
      case 9: // Meister (87 avg)
        this.targetAccuracy = 0.70;
        this.consistencyFactor = 0.65;
        break;
      case 10: // Weltklasse (100 avg)
        this.targetAccuracy = 0.85;
        this.consistencyFactor = 0.80;
        break;
    }
    
    console.log(`Bot konfiguriert: Level ${this.difficultyLevel} (${this.difficultyName})`);
  
  }
  
  /**
   * Get the bot's difficulty name and level
   */
  getDifficultyLabel(): string {
    return `${this.difficultyName} (Level ${this.difficultyLevel})`;
  }
  
  /**
   * Calculate the bot's throw for X01 game based on difficulty level
   */
  throwX01Dart(currentScore: number, dartNumber: number): DartThrow {
    // Level 1-3: Anfänger-Strategie
    if (this.difficultyLevel <= 3) {
      // Anfänger zielen oft auf 20, treffen aber selten Triples
      if (Math.random() < 0.7) {
        const goForTriple = Math.random() < (this.difficultyLevel * 0.05); // 5-15% Chance
        return this.aimForTarget(20, goForTriple ? 3 : 1);
      } else {
        // Zufällige Ziele, selten auf Triples abzielen
        const randomTargets = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10];
        const target = randomTargets[Math.floor(Math.random() * randomTargets.length)];
        const goForTriple = Math.random() < (this.difficultyLevel * 0.03); // 3-9% Chance
        return this.aimForTarget(target, goForTriple ? 3 : 1);
      }
    }
    
    // Level 4-5: Mittlere Strategie
    if (this.difficultyLevel <= 5) {
      // Oft auf Lieblingszahlen zielen statt optimale Strategie
      if (currentScore > 100 && Math.random() < 0.4) {
        const favoriteTargets = [20, 19, 18, 16];
        const target = favoriteTargets[Math.floor(Math.random() * favoriteTargets.length)];
        const goForTriple = Math.random() < (0.3 + this.difficultyLevel * 0.05); // 50-55% Chance
        return this.aimForTarget(target, goForTriple ? 3 : 1);
      }
    }

    // Checkout-Strategie
    if (currentScore <= 170) {
      return this.calculateCheckout(currentScore, dartNumber);
    }
    
    // Standard-Strategie basierend auf Level
    if (currentScore > 100) {
      if (this.difficultyLevel >= 8) { // Geübte Spieler passen ihre Ziele an
        return this.adaptiveHighScoreTarget();
      } else {
        // Weniger erfahrene Spieler zielen meist auf T20, mit steigender Präferenz für T19/T18 als Alternative
        const targets = [20, 19, 18];
        const t20Preference = 0.4 + (this.difficultyLevel * 0.05); // 65-90% Präferenz für T20
        
        if (Math.random() < t20Preference) {
          return this.aimForTarget(20, 3); // T20
        } else {
          // T19 oder T18 als Alternativen
          const secondaryTarget = targets[Math.floor(Math.random() * 2) + 1];
          return this.aimForTarget(secondaryTarget, 3);
        }
      }
    }
    
    // Fallback
    return this.calculateCheckout(currentScore, dartNumber);
  }
  
  /**
   * Fortgeschrittene Spieler passen ihre Zielwahl je nach Erfolgsrate an
   */
  private adaptiveHighScoreTarget(): DartThrow {
    // Nur hohe Levels passen ihre Zielwahl wirklich an
    if (this.difficultyLevel < 7) {
      return this.aimForTarget(20, 3); // Niedrigere Levels zielen meist einfach auf T20
    }
    
    // Prüfe, ob wir unser bevorzugtes Ziel überdenken sollten
    if (this.t20AttemptCount >= 5) { // Nach 5 Versuchen, Erfolgsrate auswerten
      const switchThreshold = 0.5 + (this.difficultyLevel * 0.02); // 64-70% Schwelle
      
      if (this.t20SuccessRate < switchThreshold) {
        // Wechsel zu T19 oder T18, bevorzugt T19
        this.currentPreferredTarget = Math.random() < 0.7 ? 19 : 18;
      } else {
        // Bleibe bei T20, da es gut funktioniert
        this.currentPreferredTarget = 20;
      }
      
      // Tracking für nächsten Zyklus zurücksetzen
      this.t20SuccessRate = 1.0;
      this.t20AttemptCount = 0;
      this.t20SuccessCount = 0;
    }
    
    // Wurf durchführen und Ergebnis verfolgen, wenn auf T20 gezielt wird
    const dartThrow = this.aimForTarget(this.currentPreferredTarget, 3);
    
    // T20-Erfolg nur für adaptives Targeting verfolgen
    if (this.currentPreferredTarget === 20) {
      this.t20AttemptCount++;
      if (dartThrow.value === 20 && dartThrow.multiplier === 3) {
        this.t20SuccessCount++;
      }
      this.t20SuccessRate = this.t20SuccessCount / this.t20AttemptCount;
    }
    
    return dartThrow;
  }
  
  /**
   * Bot zielt auf ein bestimmtes Ziel mit Genauigkeit basierend auf Level
   */
  private aimForTarget(number: number, multiplier: number): DartThrow {
    // Basisgenauigkeit hängt vom Level ab
    let accuracy = this.targetAccuracy;
    
    // Genauigkeit je nach Ziel anpassen - Triples und Doubles sind schwieriger
    if (multiplier === 3) {
      // Triple-Genauigkeit ist viel niedriger
      accuracy *= (0.4 + this.difficultyLevel * 0.05); // 45-90% der Basisgenauigkeit
    } else if (multiplier === 2) {
      // Double-Genauigkeit ist etwas niedriger
      accuracy *= (0.5 + this.difficultyLevel * 0.05); // 55-100% der Basisgenauigkeit
    }
    
    // Zufallsfaktor basierend auf Konsistenzfaktor
    const randomVariance = Math.random() * (1 - this.consistencyFactor);
    accuracy *= (1 - randomVariance);
    
    // Bei niedrigen Levels explizite Obergrenze für Genauigkeit
    if (this.difficultyLevel < 3 && accuracy > 0.3) {
      accuracy = 0.3;
    } else if (this.difficultyLevel < 5 && accuracy > 0.5) {
      accuracy = 0.5;
    }
    
    const hit = Math.random() <= accuracy;
    
    if (hit) {
      return {
        value: number,
        multiplier: multiplier,
        points: number * multiplier
      };
    } else {
      return this.calculateMiss(number, multiplier);
    }
  }
  
  /**
   * Berechne, wo der Dartpfeil bei einem Fehlwurf landet
   */
  private calculateMiss(targetNumber: number, targetMultiplier: number): DartThrow {
    // Für schwache Spieler weiter entfernter Miss
    let neighborNumbers;
    if (this.difficultyLevel <= 3) {
      // Anfänger können viel weiter daneben werfen
      neighborNumbers = [
        targetNumber,
        (targetNumber + 1) > 20 ? 1 : targetNumber + 1,
        (targetNumber - 1) < 1 ? 20 : targetNumber - 1,
        (targetNumber + 3) > 20 ? (targetNumber + 3) - 20 : targetNumber + 3,
        (targetNumber - 3) < 1 ? 20 + (targetNumber - 3) : targetNumber - 3,
        Math.floor(Math.random() * 20) + 1 // Völlig zufälliges Feld
      ];
    } else if (this.difficultyLevel <= 6) {
      // Mittlere Spieler werfen weniger weit daneben
      neighborNumbers = [
        targetNumber,
        (targetNumber + 1) > 20 ? 1 : targetNumber + 1,
        (targetNumber - 1) < 1 ? 20 : targetNumber - 1,
        (targetNumber + 2) > 20 ? (targetNumber + 2) - 20 : targetNumber + 2,
        (targetNumber - 2) < 1 ? 20 + (targetNumber - 2) : targetNumber - 2
      ];
    } else {
      // Fortgeschrittene Spieler treffen näher am Ziel
      neighborNumbers = [
        targetNumber,
        (targetNumber === 20) ? 1 : (targetNumber === 1) ? 18 : (targetNumber + 1),
        (targetNumber === 1) ? 20 : (targetNumber === 5) ? 20 : (targetNumber - 1)
      ];
    }
    
    // Multiplier-Gewichtungen basierend auf Level
    const multipliers = [1, 2, 3, 0]; // 0 = kompletter Fehlwurf
    
    // Chance auf kompletten Fehlwurf erhöhen für niedrige Levels
    const missChance = this.mapRange(this.difficultyLevel, 1, 10, 0.3, 0.01);
    
    const multiplierWeights = [
      0.6,                                    // Single - am häufigsten
      0.25 * (this.difficultyLevel / 10),     // Double - schwieriger für schwache Spieler 
      0.05 * (this.difficultyLevel / 10),     // Triple - sehr schwierig für schwache Spieler
      missChance                              // Kompletter Miss
    ];
    
    // Zahl und Multiplikator für den Fehlwurf auswählen
    const numberIndex = Math.floor(Math.random() * neighborNumbers.length);
    const number = neighborNumbers[numberIndex];
    
    // Multiplikator basierend auf Gewichten auswählen
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    let selectedMultiplier = 0;
    
    for (let i = 0; i < multipliers.length; i++) {
      cumulativeWeight += multiplierWeights[i];
      if (randomValue <= cumulativeWeight) {
        selectedMultiplier = multipliers[i];
        break;
      }
    }
    
    // Kompletter Fehlwurf
    if (selectedMultiplier === 0) {
      return { value: 0, multiplier: 1, points: 0 };
    }
    
    return { 
      value: number, 
      multiplier: selectedMultiplier,
      points: number * selectedMultiplier
    };
  }
  
  /**
   * Berechne die beste Checkout-Strategie
   */
  private calculateCheckout(score: number, dartNumber: number): DartThrow {
    // Checkout-Fähigkeit skaliert mit Level
    const checkoutProficiency = this.mapRange(this.difficultyLevel, 1, 10, 0.3, 0.9);
    
    // Für niedrigere Levels: manchmal einfach auf maximale Punktzahl spielen statt strategisch
    if (Math.random() > checkoutProficiency) {
      return this.aimForTarget(20, 3);
    }
    
    // Übliche Checkout-Strategien
    if (score <= 170) {
      // Direkte Checkouts
      if (dartNumber === 1) {
        if (score === 50) return this.aimForTarget(25, 2); // Bull
        if (score === 40) return this.aimForTarget(20, 2); // D20
        if (score === 32) return this.aimForTarget(16, 2); // D16
        if (score === 36) return this.aimForTarget(18, 2); // D18
      }
      
      // Bei geraden Scores <= 40, versuche Double-Out
      if (score <= 40 && score % 2 === 0) {
        return this.aimForTarget(score / 2, 2);
      }
      
      // Übliche Setups für bestimmte Scores
      if (score === 170) return this.aimForTarget(20, 3); // T20-T20-Bull
      if (score === 167) return this.aimForTarget(20, 3); // T20-T19-Bull
      if (score === 164) return this.aimForTarget(20, 3); // T20-T18-Bull
      if (score === 161) return this.aimForTarget(20, 3); // T20-T17-Bull
      
      // Setup-Würfe, um gute Doubles zu hinterlassen
      if (score <= 160) {
        // Versuche, ein gutes Double unter 41 zu hinterlassen
        if (score === 81) return this.aimForTarget(19, 3); // T19 hinterlässt D12
        if (score === 84) return this.aimForTarget(20, 1); // S20 hinterlässt D32
        if (score === 83) return this.aimForTarget(17, 3); // T17 hinterlässt D16
        if (score === 85) return this.aimForTarget(17, 1); // S17 hinterlässt D34
        
        // Versuche, bevorzugte Doubles zu hinterlassen: D16, D20, D18, D8, D12
        if ((score - 16*2) % 3 === 0 && score - 32 > 0)
          return this.aimForTarget((score - 32) / 3, 3); // Hinterlasse D16
        if ((score - 20*2) % 3 === 0 && score - 40 > 0)
          return this.aimForTarget((score - 40) / 3, 3); // Hinterlasse D20
      }
      
      // Allgemeine Strategie für niedrige Scores - eine gerade Zahl hinterlassen
      if ((score - 19) % 2 === 0 && score - 19 <= 40) 
        return this.aimForTarget(19, 1);
      if ((score - 18) % 2 === 0 && score - 18 <= 40) 
        return this.aimForTarget(18, 1);
      if ((score - 20) % 2 === 0 && score - 20 <= 40) 
        return this.aimForTarget(20, 1);
    }
    
    // Standard-Strategie - ziele auf hohe Punktzahlen basierend auf Fähigkeit
    if (this.difficultyLevel >= 8) {
      return Math.random() < 0.8 ? this.aimForTarget(20, 3) : this.aimForTarget(19, 3);
    } else if (this.difficultyLevel >= 5) {
      return Math.random() < 0.6 ? this.aimForTarget(20, 3) : this.aimForTarget(19, 3);  
    } else {
      // Schwächere Spieler zielen seltener auf T20
      const target = Math.random() < 0.5 ? 20 : (Math.random() < 0.5 ? 19 : 18);
      const mult = Math.random() < (0.4 + this.difficultyLevel * 0.05) ? 3 : 1;
      return this.aimForTarget(target, mult);
    }
  }
  
  /**
   * Bot-Wurf für Bulloff
   */
  throwBullOff(): DartThrow {
    // Für Bulloff, ziele auf Bull (25) mit double (2)
    return this.aimForTarget(25, 2);
  }
  
  // Hilfsfunktion zum Mappen eines Wertes von einem Bereich in einen anderen
  private mapRange(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
  }
}