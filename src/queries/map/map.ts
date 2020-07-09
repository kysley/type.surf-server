import { schema } from 'nexus'

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('map', {
      type: 'Map',
      args: {
        id: schema.idArg({ nullable: false }),
      },
      resolve: async (parent, args, ctx) => {
        return ctx.db.map.findOne({ where: { id: args.id } })
      },
    })
  },
})
