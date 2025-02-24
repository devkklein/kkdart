import { matches } from "../ws";
import { endLeg, endSet, mapPlayer, switchplayers, updateScore } from "../utils";
import { Match, Player, Sockets } from "~/types/websocket";

export function handleX01Match(match: Match, sockets: Sockets, matchId: string, currentPlayer: Player, score: number, multiplier: number) {
    try{
        
        if(match && !match.finished){
            const points = score * multiplier;
            const newScore = currentPlayer.scores.currentScore - points;
            if(newScore < 0){
                currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
                mapPlayer(match, currentPlayer);
                if(currentPlayer.scores.thrownDarts < 3){
                    switchplayers(match, sockets, currentPlayer);
                }
            }
            else if(newScore === 1 && match.settings.outMode === 'Double' || match.settings.outMode === 'Master'){
                     
                    updateScore(currentPlayer, points);
                    currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
                    mapPlayer(match, currentPlayer);
                    if(currentPlayer.scores.thrownDarts < 3){
                        console.log("switching players");
                        switchplayers(match, sockets, currentPlayer);
                    }
                

            }
            else if(newScore === 0){
                if(match.settings.outMode === 'Double'){
                    if(multiplier === 2){
                        endLeg(match, currentPlayer, sockets);
                    }
                    else{
                        currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
                        mapPlayer(match, currentPlayer);
                        if(currentPlayer.scores.thrownDarts < 3){
                            switchplayers(match, sockets, currentPlayer);
                        }
                    }
                }
                else if(match.settings.outMode === 'Master'){
                    if(multiplier === 2 || multiplier === 3){
                        endLeg(match, currentPlayer, sockets);
                    }
                }
                else{
                    updateScore(currentPlayer, points);
                    mapPlayer(match, currentPlayer);
                    endLeg(match, currentPlayer, sockets);
                }
                
            }
            else{
                updateScore(currentPlayer, points);
                mapPlayer(match, currentPlayer);
                
            }


        }

    }catch(err){
        console.error("Error during game", err);
    }
}

