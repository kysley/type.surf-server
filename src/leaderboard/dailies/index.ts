import Queue from 'bull'

import { redis } from '../../redis'

const leaderboardQueue = new Queue('leaderboard queue', {
  redis: {
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
  },
})

leaderboardQueue.process(async (job, done) => {
  redis.zadd(job.data.type, 'GT', job.data.speed, job.data.id)
  done()
})
