import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString,  } from 'graphql';
import { ProductType } from '../Product/productQueries';
import { getCategoryProducts } from './categoryResolvers';

export const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        products: {
            type: new GraphQLList(ProductType),
            resolve: (category) => {
                return getCategoryProducts(category.id);
            },
        },
    }),
});
