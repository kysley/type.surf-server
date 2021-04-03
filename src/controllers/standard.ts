import { customAlphabet } from 'nanoid'
import { Socket } from 'socket.io'
import { words } from 'wordkit'

import {
  BaseControllerConstructor,
  Modes,
  RaceConstructor,
  RoomState,
} from '../../types'
import { sleep } from '../helpers'
import { io } from '../server'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)

function makeRoomKey(id: string) {
  return `room.${id}`
}

function or(comparator: any, operators: any[]) {
  return operators.some((operator) => {
    if (typeof operator === 'function') {
      return operator(comparator)
    } else {
      return comparator === operator // this obv doesnt work well for functions but that is what deep compares are for
    }
  })
}

// Mode:
// Race: First person to finish the list of words
// Circuit/Time Attack: Best 2 of 3? 3 of 5? Different words each time
//
export abstract class BaseController {
  id: string
  invitesEnabled: boolean
  players: any[] = []
  // playerSockets: any[] = [] //<{socket: Socket, userId: string}>
  words: string[] = []
  name: string
  state: RoomState
  key: string
  readyIds: string[] = []
  abstract mode: Modes

  interval?: any = undefined

  constructor({
    invitesEnabled = false,
    name,
    state = 'LOBBY',
    id,
  }: BaseControllerConstructor) {
    const thisID = id ?? nanoid()
    this.id = thisID
    this.invitesEnabled = invitesEnabled
    this.name = name ?? `Room ${thisID}`
    this.state = state
    this.key = makeRoomKey(thisID)
  }

  broadcast(data: any) {
    io.to(this.key).emit('server.room.broadcast', data)
  }

  ack(data: any, userId: string) {
    console.log('ack', data, userId)
    this.players = this.players.map((player) => {
      if (player.userId === userId) {
        return {
          ...player,
          ...data,
        }
      }
      return player
    })
    this.broadcast({ players: this.players })
  }

  readyCheck(isReady: boolean, userId: string) {
    if (isReady) {
      this.readyIds.push(userId)
      if (this.readyIds.length === this.players.length) {
        this.transitionState('STARTING')
      }
    } else {
      this.readyIds = this.readyIds.filter((id) => id !== userId)
    }
  }

  async connectPlayer(socket: Socket, identity: any) {
    if (this.players.length < 4) {
      socket.join(this.key)
      this.players.push({ ...identity, stats: { wpm: 0 } })
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

    // if (this.state === 'LOBBY' && this.players.length >= 2) {
    //   this.transitionState('STARTING')
    // }
  }

  disconnectPlayer(userId: string): boolean | void {
    console.log('disconnecting player ', userId)

    this.players = this.players.filter((player) => player.userId !== userId)
    this.broadcast({ players: this.players })
    this.readyCheck(false, userId)

    if (this.players.length === 0) {
      this.transitionState('ENDING')
      return true
    }
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
    console.log(`[TRANSITION] ${this.state} -> ${to}`)
    switch (to) {
      case 'STARTING':
        this.countdown()
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
        this.state = 'LOBBY'
        break
      default:
        console.warn('transitionState: default!')
    }
    this.broadcast({ state: to })
    console.log(to)
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
    this.transitionState('LOBBY')
  }

  abstract update(): void
  abstract setup(): void
}

export class Race extends BaseController {
  duration: number = 60
  cur: number = 0
  mode = Modes.RACE

  constructor(race: RaceConstructor) {
    super(race)
    Object.assign(this, race)
    // const idcs = new seed({ seed: this.id })
    // this.words = grabWords(idcs).split('|')
    this.words = words(race.length || 60).split(',')
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
    if (this.cur < this.duration) this.transitionState('STARTED')
    else if (this.cur === this.duration) this.transitionState('ENDING')
    else this.transitionState('LOBBY')
  }
}
