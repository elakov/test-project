import { GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLString  } from 'graphql';

export const OrderProductInputType = new GraphQLInputObjectType({
    name: 'OrderProductInput',
    fields: () => ({
        id: { type: GraphQLInt },
        count: { type: GraphQLInt },
    })
});

export const OrderInputType = new GraphQLInputObjectType({
    name: 'OrderInput',
    fields: () => ({
        products: { type: new GraphQLList(OrderProductInputType) },
    }),
})