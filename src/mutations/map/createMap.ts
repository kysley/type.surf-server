import { schema } from 'nexus'

export const MapInput = schema.inputObjectType({
  name: 'MapInput',
  definition(t) {
    t.string('name')
    t.list.field('mods', {
      type: 'Mods',
    })
    // t.field('mode', { type: 'Mode', nullable: false })
    t.string('description')
    t.string('wordSet')
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createMap', {
      type: 'Map',
      args: {
        data: schema.arg({ type: MapInput, nullable: false }),
      },
      resolve: async (parent, args, ctx) => {
        const { id } = await ctx.user.getCurrentUser()
        if (!id) {
          throw new Error('You must be signed in to create a Map.')
        }

        const { mods, ...rest } = args.data
        const $map = ctx.db.map.create({
          data: {
            ...rest,
            mods: {
              set: mods,
            },
            creator: {
              connect: {
                id,
              },
            },
          },
        })
        return $map
      },
    })
  },
})
