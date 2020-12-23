import { sleep } from '../helpers'
import { io } from '../server'
import { players_global } from '../socket'
import { BaseController } from './'

function makeRoomKey(id: string) {
  return `room.${id}`
}

export class Standard implements BaseController {
  id
  invitesEnabled
  players
  name
  state
  key

  constructor({
    id,
    invitesEnabled = false,
    players,
    name = 'Test Realm',
    state = 'LOBBY',
  }: BaseController) {
    this.id = id
    this.invitesEnabled = invitesEnabled
    this.players = players
    this.name = name
    this.state = state
    this.key = makeRoomKey(id)

    // this.init()
  }

  // maybe hanle this inside of the queue, or wherever is creating the controller
  // init() {
  //   this.players.forEach((player) => this.connectPlayer)
  // }

  broadcast(data: any) {
    io.to(this.key).emit('server.broadcast', data)
  }

  request(type: string) {
    io.to(this.key).emit(`server.request.${type}`)
  }

  connectPlayer(socketId: string) {
    if (this.players.length < 4) {
      io.sockets.sockets.get(socketId)?.join(this.key)
      this.players.push(players_global.get(socketId))
      this.broadcast({ players: this.players })
    } else {
      throw new Error('Lobby full!')
    }

    if (this.state === 'LOBBY' && this.players.length === 4) {
      this.countdown()
    }
  }

  async countdown() {
    let countdown = 5
    while (countdown >= 0) {
      this.broadcast({ countdown })
      countdown--
      await sleep(1000)
    }
    this.begin()
  }

  async begin() {
    this.broadcast({ start: true })

    let duration = 15 // short for testing
    // we will want to have a duration field for standard
    // probably a class method for more complex modes. They
    // all just extend BaseController anyways.
    while (duration >= 0) {
      this.request('state')
      duration--
      await sleep(1000)
    }
    this.end()
  }

  end() {
    this.broadcast({ stop: true })
  }
}
