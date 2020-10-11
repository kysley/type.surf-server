import { asNexusMethod, makeSchema } from '@nexus/schema'
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import path from 'path'

import * as types from './Defs'

const jsonScalar = asNexusMethod(JSONObjectResolver, 'json')
const dateTimeScalar = asNexusMethod(DateTimeResolver, 'date')

export const schema = makeSchema({
  // shouldExitAfterGenerateArtifacts: Boolean(
  //   process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
  // ),
  types,
  typegenAutoConfig: {
    sources: [
      {
        source: '.prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('../context.ts'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
    // : 'ContextModule.Context',
  },
  outputs: {
    typegen: path.join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts',
    ),
    schema: path.join(__dirname, './api.graphql'),
  },
  plugins: [
    nexusSchemaPrisma({
      scalars: {
        DateTime: DateTimeResolver,
      },
      // scalars: {

      // DateTime: DateTimeResolver,
      // Json: new GraphQLScalarType({
      //   ...JSONObjectResolver,
      //   name: 'Json',
      //   description:
      //     'The `JSON` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
      // }),
      // },
    }),
  ],
})
