import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_PORT, {
  password: process.env.REDIS_PASSWORD,
})

export const PLAYER_KEY = '__players'

export async function setPlayerData(key: string, player: any) {
  const array = Object.keys(player).reduce((acc, key) => {
    acc.push(key)
    acc.push(player[key])
    return acc
  }, [] as string[])
  await redis.hmset(key, array)
  return key
}

export async function removePlayerData(key: string) {
  return redis.hdel(key)
}

export async function getPlayerData(key: string) {
  return redis.hgetall(key)
}
