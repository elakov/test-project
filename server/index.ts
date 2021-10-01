import { createServer } from 'http';
import { graphqlHTTP } from "express-graphql";
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { ProductType } from './entities/Product/productQueries';
import { createProduct, getProducts } from './entities/Product/productResolvers';
import { CategoryType } from './entities/Category/categoryQueries';
import { getCategories, getCategoryProducts } from './entities/Category/categoryResolvers';
import { ProductInputType } from './entities/Product/productMutations';
import { OrderType } from './entities/Order/orderQueries';
import { getOrders } from './entities/Order/orderResolvers';

const QueryRootType = new GraphQLObjectType({
    name:'Query',
    fields: () => ({
        products: {
            args: {
                categoryId: { type: GraphQLInt },
            },
            type: new GraphQLList(ProductType),
            resolve: (_, args) => {
                if (args?.categoryId !== undefined) {
                    return getCategoryProducts(args.categoryId);
                }
                return getProducts();
            },
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve: () => {
                return getCategories();
            },
        },
        orders: {
            type: new GraphQLList(OrderType),
            resolve: () => {
                return getOrders();
            }
        }
    })
});

const MutationsRootType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createProduct: {
            type: ProductType,
            args: {
                product: { type: ProductInputType },
            },
            resolve: (value, { product }) => {
                return createProduct(product);
            },
        },
    }),
})

createServer(
  graphqlHTTP({
    schema: new GraphQLSchema({ query: QueryRootType, mutation: MutationsRootType }),
    graphiql: { headerEditorEnabled: true },
  }),
).listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
