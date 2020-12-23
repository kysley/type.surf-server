import { idArg, queryField, queryType } from 'nexus'

export const Me = queryField('me', {
  type: 'Account',
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
    id: idArg(),
  },
  resolve: async (parent, args, ctx) => {
    return ctx.db.map.findOne({ where: { id: args.id } })
  },
})
