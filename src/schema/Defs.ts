import {
  objectType,
  arg,
  intArg,
  inputObjectType,
  enumType,
  scalarType,
} from 'nexus'

export * from './Query'
export * from './Mutation'

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.model.history()
    // t.boolean('confirmed')
    t.model.confirmed()
    // t.field('createdAt', { type: DateTime })
    t.model.createdAt()
    // t.string('email')
    t.model.email()
    // t.list.field('history', {
    //   type: Result,
    //   args: {
    //     after: arg({ type: ResultWhereUniqueInput }),
    //     before: arg({ type: ResultWhereUniqueInput }),
    //     first: intArg(),
    //     last: intArg(),
    //     orderBy: arg({
    //       type: AccountHistoryOrderByInput,
    //       list: true,
    //     }),
    //   },
    // })
    t.model.history()
    // t.string('id')
    t.model.history()
    t.model.id()
    t.model.lastSeen()
    // t.field('lastSeen', { type: DateTime })
    // t.list.field('maps', {
    //   type: Map,
    //   args: {
    //     after: arg({ type: MapWhereUniqueInput }),
    //     before: arg({ type: MapWhereUniqueInput }),
    //     first: intArg(),
    //     last: intArg(),
    //   },
    // })
    t.model.maps()
    // t.field('rank, { type: Rank })
    t.model.rank()
    // t.field('role', { type: Role })
    t.model.role()
    // t.field('updatedAt', { type: DateTime })
    t.model.updatedAt()
    // t.string('username')
    t.model.username()
  },
})

export const Map = objectType({
  name: 'Map',
  definition(t) {
    // t.field('createdAt', { type: DateTime }
    t.model.createdAt()
    // t.field('creator', {
    //   type: Account,
    //   nullable: true,
    // })
    t.model.creator()
    // t.boolean('custom', { nullable: true })
    t.model.custom()
    // t.string('id')
    t.model.id()
    // t.string('name')
    t.model.name()
    // t.boolean('published', { nullable: true })
    t.model.published()
    // t.field('updatedAt', { type: DateTime })
    t.model.updatedAt()
    // t.string('wordset')
    t.model.wordset()
  },
})

export const Result = objectType({
  name: 'Result',
  definition(t) {
    t.model.account()
    t.model.correct()
    t.model.corrections()
    t.model.cpm()
    t.model.createdAt()
    t.model.id()
    t.model.incorrect()
    // t.model.map()
    t.model.map()
    t.model.mode()
    t.model.mods()
    t.model.rawCpm()
    t.model.wordIndex()
    t.model.wpm()
    t.model.rawCpm()
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.field('account', {
      type: Account,
      nullable: true,
    })
    t.string('token', { nullable: true })
  },
})

// const Query = objectType({
//   name: 'Query',
//   definition(t) {
//     t.boolean('ok')
//   },
// })

export const ResultInput = inputObjectType({
  name: 'ResultInput',
  definition(t) {
    t.int('correct', { nullable: false })
    t.int('corrections', { nullable: false })
    t.int('cpm', { nullable: false })
    t.int('rawCpm', { nullable: false })
    t.int('wpm', { nullable: false })
    t.int('rawWpm', { nullable: false })
    t.int('incorrect', { nullable: false })
    t.int('wordIndex', { nullable: false })
    t.int('letterIndex', { nullable: false })
    t.int('history', { nullable: false })
    t.boolean('punctuated', { nullable: false })
    t.string('state', { nullable: false })
    t.string('seed')
    t.field('mode', { type: 'Mode', nullable: false })
    t.string('slug', { nullable: false })
    t.list.field('mods', { type: 'Mods', nullable: false })
    t.id('mapId', { nullable: false })
  },
})

export const AccountHistoryOrderByInput = inputObjectType({
  name: 'AccountHistoryOrderByInput',
  definition(t) {
    t.field('createdAt', { type: SortOrder })
    t.field('mode', { type: SortOrder })
    t.field('wpm', { type: SortOrder })
  },
})

export const MapWhereUniqueInput = inputObjectType({
  name: 'MapWhereUniqueInput',
  definition(t) {
    t.string('id')
  },
})

export const ResultWhereUniqueInput = inputObjectType({
  name: 'ResultWhereUniqueInput',
  definition(t) {
    t.string('id')
  },
})

export const Difficulty = enumType({
  name: 'Difficulty',
  members: ['EASY', 'HARD', 'MEDIUM', 'NORMAL'],
})

export const Mode = enumType({
  name: 'Mode',
  members: ['Classic', 'Race', 'Takedown', 'TimeAttack'],
})

export const Mods = enumType({
  name: 'Mods',
  members: ['Perfectionist', 'Rush'],
})

export const Rank = enumType({
  name: 'Rank',
  members: [
    'Beginner',
    'Competent',
    'Expert',
    'Master',
    'Novice',
    'Proficient',
  ],
})

export const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'BETA', 'PRO', 'USER'],
})

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})
