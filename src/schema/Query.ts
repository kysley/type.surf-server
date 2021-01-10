import { idArg, queryField, queryType } from 'nexus'

export const Me = queryField('me', {
  type: 'Account',
  resolve: async (parent, args, ctx) => {
    const id = ctx.userId
    console.log(id)
    return await ctx.prisma.account.findUnique({ where: { id } })
  },
})
