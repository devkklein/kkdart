export interface Player{
    id: number;
    username: string;
    profileImage: string | null;  
    currentScore?: number;
}
export interface Players{
    users: Player[];    
}

export interface OfflineGame {
    id: string;
    creatorId: number;
    players: Player[];
    basescore: number;
    inMode: string;
    outMode: string;
    legCount: number;
    setCount: number;
    // neu:
    startingPlayerId?: string | null;
}