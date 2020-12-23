import { schema } from 'nexus'

import { MapInput } from './createMap'

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateMap', {
      type: 'Map',
      args: {
        id: schema.idArg(),
        data: schema.arg({ type: MapInput, nullable: false }),
      },
      resolve: async (parent, args, ctx) => {
        const { id: userId } = await ctx.user.getCurrentUser()
        if (!userId) {
          throw new Error('You must be signed in to update a Map.')
        }
        const $owner = await ctx.db.map.count({
          where: {
            AND: [
              {
                id: args.id,
              },
              {
                creatorId: userId,
              },
            ],
          },
        })
        if ($owner > 0) {
          const $update = await ctx.db.map.update({
            where: {
              id: args.id,
            },
            data: {
              ...args.data,
              mods: {
                set: args.data.mods,
              },
            },
          })
          return $update
        } else {
          throw new Error('You do not own this Map.')
        }
      },
    })
  },
})
