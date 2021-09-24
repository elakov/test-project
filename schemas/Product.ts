import { Category } from "./Category";

export type Product = {
    id: number;
    name: string;
    price: number;
    category: Category;
}

export type ProductInput = {
    name: string;
    price: number;
    categoryId: number;
}