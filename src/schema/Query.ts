import { idArg, nonNull, queryField, queryType, stringArg } from 'nexus'

export const Me = queryField('Me', {
  type: 'Account',
  resolve: async (parent, args, ctx) => {
    const id = ctx.userId
    console.log(id)
    return await ctx.prisma.account.findUnique({ where: { id } })
  },
})

export const User = queryField('User', {
  type: 'Account',
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (parent, args, ctx) => {
    return await ctx.prisma.account.findUnique({
      where: {
        id: args.id,
      },
      include: {
        history: {
          orderBy: {
            wpm: 'desc',
          },
        },
      },
    })
  },
})
