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
    t.model.confirmed()
    t.model.createdAt()
    t.model.email()
    t.model.history()
    t.model.id()
    t.model.lastSeen()
    t.model.level()
    t.model.exp()
    t.model.discriminator()
    t.model.role()
    t.model.updatedAt()
    t.model.username()
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
    })
    t.string('token', {})
  },
})

export const ResultInput = inputObjectType({
  name: 'ResultInput',
  definition(t) {
    t.int('correct')
    t.int('corrections')
    t.int('cpm')
    t.int('rawCpm')
    t.int('wpm')
    t.int('rawWpm')
    t.int('incorrect')
    t.int('wordIndex')
    t.int('letterIndex')
    t.int('history')
    t.boolean('punctuated')
    t.string('state')
    t.string('seed')
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

export const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'BETA', 'PRO', 'USER'],
})

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})
