import { query } from '../../db';

export const getCategoryProducts = async (categoryId: number) => {
    const products = await query(`
        SELECT * FROM products
        WHERE category_id = $1;
    `, [String(categoryId)]);

    return products.rows;
};

export const getCategories = async () => {
    const categories = await query(`SELECT * from categories;`);

    return categories.rows;
}


