import { ProductInput } from '../../../schemas/Product';
import { query } from '../../db';

export const getProducts = async () => {
    const products = await query(`SELECT * FROM products;`);
    return products.rows;
}

export const getProductCategory = async (productId: number) => {
    const categories = await query(`
        SELECT categories.id, categories.name FROM categories INNER JOIN products ON categories.id = products.category_id
        WHERE products.id = $1;
    `, [String(productId)]);

    return categories.rows[0];
}

export const createProduct = async (product: ProductInput) => {
    const data = await query(`INSERT INTO public.products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *;`, [product.name, String(product.price), String(product.categoryId)]);
    return data.rows[0];
}

