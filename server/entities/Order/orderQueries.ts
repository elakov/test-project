import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ProductType } from '../Product/productQueries';
import { getOrderProducts } from './orderResolvers';
// import { getProductCategory } from './productResolvers';

export const OrderProductType = new GraphQLObjectType({
    name: 'OrderProduct',
    fields: () => ({
        ...ProductType.toConfig().fields,
        count: { type: GraphQLInt }
    }),
})

export const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        price: { type: GraphQLFloat },
        products: {
            type: new GraphQLList(OrderProductType),
            resolve: (order) => {
                return getOrderProducts(order.id);
            }
        }
    }),
});
