import { customAlphabet } from 'nanoid'
import { Socket } from 'socket.io'
import { seed, grabWords } from 'wordkit'

import { sleep } from '../helpers'
import { getPlayerData } from '../redis'
import { io } from '../server'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)

function makeRoomKey(id: string) {
  return `room.${id}`
}

interface BaseControllerConstructor {
  invitesEnabled?: boolean
  name?: string
  state?: RoomState
}

type RoomState = 'LOBBY' | 'STARTED' | 'PAUSED' | 'ENDING' | 'STARTING'

export abstract class BaseController {
  id
  invitesEnabled
  players: any[] = []
  playerSockets: any[] = [] //<{socket: Socket, userId: string}>
  words: string[] = []
  name
  state
  key

  interval?: any = undefined

  constructor({
    invitesEnabled = false,
    name = 'Test Realm',
    state = 'LOBBY',
  }: BaseControllerConstructor) {
    const thisID = nanoid()
    this.id = thisID
    this.invitesEnabled = invitesEnabled
    this.name = name
    this.state = state
    this.key = makeRoomKey(thisID)
  }

  broadcast(data: any) {
    io.to(this.key).emit('server.room.broadcast', data)
  }

  ack(error: any, data: any) {
    console.log('ack', data)
    this.players = this.players.map((player) => {
      if (player.userId === data.userId) {
        return {
          ...data,
          ...player,
        }
      }
      return player
    })
    this.broadcast({ players: this.players })
  }

  request(type: string) {
    this.playerSockets.forEach((pair) => {
      pair.socket.emit(`server.request.${type}`, (error, data) => {
        this.ack(error, data)
      })
    })
  }

  async connectPlayer(socket: Socket, playerData: any) {
    if (this.players.length < 4) {
      // await io.sockets.sockets.get(socketId)?.join(this.key)
      socket.join(this.key)
      this.playerSockets.push({ socket, userId: playerData.userId })
      this.players.push(playerData)
      this.broadcast({
        players: this.players,
        id: this.id,
        name: this.name,
        state: this.state,
        words: this.words,
      })
    } else {
      throw new Error('Lobby full!')
    }

    if (this.state === 'LOBBY' && this.players.length === 4) {
      this.transitionState('STARTING')
    } else if (this.state === 'LOBBY' && this.players.length >= 2) {
      this.countdown(10)
    }
  }

  async disconnectPlayer(socketId: string) {
    io.sockets.sockets.get(socketId)?.leave(this.key)
    const userPair = this.playerSockets.filter(
      (pair) => pair.socket.socketId !== socketId,
    )
    this.players.filter((player) => player.userId !== userPair[0].userId)
    this.broadcast({ players: this.players })
  }

  async countdown(duration?: number) {
    let countdown = duration || 5
    while (countdown >= 0) {
      this.broadcast({ countdown })
      countdown--
      await sleep(1000)
    }
    this.transitionState('STARTED')
  }

  async transitionState(to: RoomState) {
    if (this.state === to) return // dont transition if state is the same
    switch (to) {
      case 'STARTING':
        await this.countdown()
        break
      case 'STARTED':
        this.begin()
        break
      case 'ENDING':
        this.end()
        break
      case 'PAUSED':
        //todo
        break
      case 'LOBBY':
        break
      default:
        console.warn('transitionState: default!')
    }
    this.broadcast({ state: to })
    this.state = to
  }

  async begin() {
    this.setup()
    this.broadcast({ start: true })

    this.interval = setInterval(() => {
      this.update()
    }, 1000)
  }

  end() {
    clearInterval(this.interval)
    this.broadcast({ stop: true })
  }

  abstract update(): void
  abstract setup(): void
}

interface RaceConstructor extends BaseControllerConstructor {
  duration?: number
  length: 60 | 120 | 180 | 300
}
export class Race extends BaseController {
  duration: number = 60
  cur: number = 0

  constructor(race: RaceConstructor) {
    super(race)
    Object.assign(this, race)
    const idcs = new seed({ seed: this.key }).nRandom(race.length)
    this.words = grabWords(idcs).split('|')
  }

  setup() {
    const int = setInterval(() => {
      if (this.cur === this.duration) {
        clearInterval(int)
      }
      this.cur += 1
    }, 1000)
  }

  update() {
    this.request('stats')
    if (this.cur < this.duration) this.transitionState('STARTED')
    else if (this.cur === this.duration) this.transitionState('ENDING')
    else this.transitionState('LOBBY')
  }
}
