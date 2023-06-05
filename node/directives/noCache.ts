import type { GraphQLField } from 'graphql';
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export class NoCache extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (root: any, args: any, ctx: any, info: any) => {
      const {
        graphql: { cacheControl },
      } = ctx

      cacheControl.noCache = true
      cacheControl.noStore = true

      return resolve(root, args, ctx, info)
    }
  }
}
