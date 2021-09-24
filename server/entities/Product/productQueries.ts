import { GraphQLFloat, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString,  } from 'graphql';
import { CategoryType } from '../Category/categoryQueries';
import { getProductCategory } from './productResolvers';

export const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        category: {
            type: CategoryType,
            resolve: (product) => {
                return getProductCategory(product.id);
            }
        }
    }),
});
