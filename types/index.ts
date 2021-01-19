export type RoomState = 'LOBBY' | 'STARTED' | 'PAUSED' | 'ENDING' | 'STARTING'

export enum Modes {
  RACE = 'RACE',
  CIRCUIT = 'CIRCUIT',
}

export interface BaseControllerConstructor {
  invitesEnabled?: boolean
  name?: string
  state?: RoomState
}

export interface RaceConstructor extends BaseControllerConstructor {
  duration?: number
  length?: number
}
