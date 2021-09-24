import { createQueryCreator } from "."

type Product = {
    name: string;
    price: number;
    category: Category;
}

type Category = {
    name: string;
    products: Product[];
}

type Query = {
    products: Product[];
    categories: Category[];
}

const query = createQueryCreator<Query>();

const data = query((b) => b.add('products', (p) => p.add('name')));

console.log(data);
data.products[0].name
