export interface BaseController {
  id: string
  invitesEnabled: boolean
  name: string
  state: 'LOBBY' | 'GAME'
  players: any[]
  key: string
}

export type PlayerConnection = {
  id: string
  username: string
}

export type PlayerData = PlayerConnection & {
  history: boolean[]
}
