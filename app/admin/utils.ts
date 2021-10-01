import { History } from "../../packages/Router/history";
import { Router } from "../../packages/Router/Router";

export const history = new History();

export const router = new Router({
    products: '/products',
    newProduct: '/product/new',
    newOrder: '/order/new',
});