export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'pro'

export interface DartThrow {
  value: number
  multiplier: number
  points: number
}

export interface BotSettings {
  difficulty: BotDifficulty
  name: string
  avatar?: string
}