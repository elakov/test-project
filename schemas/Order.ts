import { Product } from "./Product"

export type OrderProductInput = {
    id: number;
    count: number;
}

export type OrderInput = {
    products: OrderProductInput[];
}

export type OrderProduct = Product & {
    count: number;
}

export type Order = {
    id: number;
    products: Product[];
    price: number;
}