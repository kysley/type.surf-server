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
    t.model.cpm()
    t.model.createdAt()
    t.model.id()
    // t.model.map()
    t.model.wpm()
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

export const WordsetPayload = objectType({
  name: 'WordsetPayload',
  definition(t) {
    t.string('wordset'), t.string('seed')
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
export const Mode = enumType({
  name: 'Mode',
  members: ['TIME', 'WORDS'],
})

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})
