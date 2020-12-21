import { asNexusMethod, makeSchema } from 'nexus'
import path from 'path'

import * as types from './Defs'

export const schema = makeSchema({
  types,
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: path.join(__dirname, '../context.ts'),
    export: 'Context',
  },
  // typegenAutoConfig: {
  //   sources: [
  //     {
  //       source: '.prisma/client',
  //       alias: 'prisma',
  //     },
  //     {
  //       source: require.resolve('../context.ts'),
  //       alias: 'Context',
  //     },
  //   ],
  //   contextType: 'Context.Context',
  //   // : 'ContextModule.Context',
  // },
  outputs: {
    typegen: path.join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts',
    ),
    schema: path.join(__dirname, './api.graphql'),
  },
  shouldExitAfterGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
  ),
})
