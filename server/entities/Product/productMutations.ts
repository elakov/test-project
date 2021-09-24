import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLString  } from 'graphql';

export const ProductInputType = new GraphQLInputObjectType({
    name: 'ProductInput',
    fields: () => ({
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        categoryId: { type: GraphQLInt },
    })
});
