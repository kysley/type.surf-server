import { schema } from 'nexus'

schema.queryType({
  definition(t) {
    t.field('me', {
      type: 'Account',
      nullable: true,
      resolve: async (parent, args, ctx) => {
        const { id } = await ctx.user.getCurrentUser()
        return ctx.db.account.findOne({ where: { id } })
      },
    })
  },
})
