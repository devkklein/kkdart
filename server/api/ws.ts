interface Match {
  players: WebSocket[]
}

const matches: Record<string, Match> = {}

export default defineWebSocketHandler({
  open(socket){
    console.log('Neur Spieler verbunden')
  },
  message(socket, message){
    const data = JSON.parse(message)
    if(data.type === 'create-match'){
      const matchId = crypto.randomUUID()
      matches[matchId] = {
        players: [socket]
      }
      socket.send(JSON.stringify({
        type: 'match-created',
        matchId
      }))
    }
  }
})
