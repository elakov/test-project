import { OrderInput } from '../../../schemas/Order';
import { query } from '../../db';

export const getOrders = async () => {
    const orders = await query(`SELECT * from orders;`);

    return orders.rows;
}

export const getOrderProducts = async (orderId: number) => {
    const products = await query(`
        SELECT products.id, products.name, order_products.price, products.category_id, order_products.count
        FROM orders
        INNER JOIN order_products ON order_products.order_id = orders.id
        INNER JOIN products ON order_products.product_id = products.id
        WHERE orders.id = $1;
    `, [String(orderId)]);
    return products.rows;
}



export const createOrder = async (order: OrderInput) => {
    const orders = await query(`
        WITH ins AS (
            INSERT INTO
        )
    `);
}