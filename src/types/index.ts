import { schema } from 'nexus'

schema.objectType({
  name: 'Account',
  definition(t) {
    t.model.color()
    t.model.confirmed()
    t.model.createdAt()
    t.model.email()
    t.model.id()
    t.model.lastSeen()
    t.model.role()
    t.model.updatedAt()
    t.model.username()
    t.model.digits()
    t.model.rank()
    t.model.history({ ordering: { createdAt: true, mode: true, wpm: true } })
    t.model.maps()
  },
})

schema.objectType({
  name: 'Result',
  definition(t) {
    t.model.correct()
    t.model.corrections()
    t.model.cpm()
    t.model.createdAt()
    t.model.id()
    t.model.incorrect()
    t.model.rawCpm()
    t.model.mode()
    t.model.mods()
    t.model.wordIndex()
    t.model.wpm()
    t.model.map()
    t.model.account()
  },
})

schema.objectType({
  name: 'Map',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.mode()
    t.model.mods()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.custom()
    t.model.difficulty()
    t.model.description()
    t.model.published()
    t.model.wordset()
    // t.model.results()
    t.model.creator()
  },
})

schema.objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token'), t.field('account', { type: 'Account' })
  },
})

schema.enumType({
  name: 'Mode',
  members: ['Classic', 'Race', 'TimeAttack', 'Takedown'],
})

schema.enumType({
  name: 'Mods',
  members: ['Rush', 'Perfectionist'],
})

schema.enumType({
  name: 'Rank',
  members: [
    'Novice',
    'Beginner',
    'Competent',
    'Proficient',
    'Expert',
    'Master',
  ],
})

schema.enumType({
  name: 'Role',
  members: ['USER', 'ADMIN', 'PRO', 'BETA'],
})

schema.enumType({
  name: 'Difficulty',
  members: ['EASY', 'NORMAL', 'MEDIUM', 'HARD'],
})
