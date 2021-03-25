import Queue from 'bull'

import { redis } from '../../redis'

const leaderboardQueue = new Queue('leaderboard queue', {
  redis: {
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  },
})

leaderboardQueue.process(async (job) => {})
