import { idArg, queryField, queryType } from '@nexus/schema'

export const Me = queryField('me', {
  type: 'Account',
  nullable: true,
  resolve: async (parent, args, ctx) => {
    const id = await (await ctx.user).id
    // const { id } = await ctx
  },
})
// export const Me = queryType({
//   definition(t) {
//     t.field('me', {
//       type: 'Account',
//       nullable: true,
//       resolve: async (parent, args, ctx) => {
//         const id = await (await ctx.user).id
//         // const { id } = await ctx
//       },
//     })
//   },
// })

export const MapById = queryField('mapById', {
  type: 'Map',
  args: {
    id: idArg({ nullable: false }),
  },
  resolve: async (parent, args, ctx) => {
    return ctx.db.map.findOne({ where: { id: args.id } })
  },
})
