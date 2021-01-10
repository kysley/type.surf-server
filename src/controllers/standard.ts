import { customAlphabet } from 'nanoid'

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
  playerSocketIds: any[] = []
  name
  state
  key

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
    return 'hi'
  }

  request(type: string) {
    io.to(this.key).emit(`server.request.${type}`)
  }

  async connectPlayer(socketId: string, playerData: any) {
    if (this.players.length < 4) {
      await io.sockets.sockets.get(socketId)?.join(this.key)
      this.playerSocketIds.push({ socketId, userId: playerData.userId })
      this.players.push(playerData)
      this.broadcast({
        players: this.players,
        id: this.id,
        name: this.name,
        state: this.state,
      })
    } else {
      throw new Error('Lobby full!')
    }

    if (this.state === 'LOBBY' && this.players.length === 4) {
      this.transitionState('STARTING')
    }
  }

  async disconnectPlayer(socketId: string) {
    io.sockets.sockets.get(socketId)?.leave(this.key)
    const userPair = this.playerSocketIds.filter(
      (pair) => pair.socketId !== socketId,
    )
    this.players.filter((player) => player.userId !== userPair[0].userId)
    this.broadcast({ players: this.players })
  }

  async countdown() {
    let countdown = 5
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
      case 'STARTED':
        this.begin()
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
    this.broadcast(to)
    this.state = to
  }

  async begin() {
    this.broadcast({ start: true })

    do {
      this.request('state')
      const nextState = this.communicate()
      this.transitionState(nextState)
      await sleep(1000)
    } while (this.state === 'STARTED')
    this.end()
  }

  end() {
    this.broadcast({ stop: true })
  }

  abstract communicate(): RoomState
  abstract setup(): void
}

interface RaceConstructor extends BaseControllerConstructor {
  duration?: number
}
export class Race extends BaseController {
  duration: number = 60
  cur: number = 0

  constructor(race: RaceConstructor) {
    super(race)
    Object.assign(this, race)
    // this.setup()
  }

  setup() {
    const int = setInterval(() => {
      if (this.cur === this.duration) {
        clearInterval(int)
      }
      this.cur += 1
    }, 1000)
  }

  communicate() {
    if (this.cur < this.duration) return 'STARTED'
    else if (this.cur === this.duration) return 'ENDING'
    return 'LOBBY'
  }
}
