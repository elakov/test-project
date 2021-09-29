/* import { OrderInput, Order } from '../../../schemas/Order'; */
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

const createPlaceholder = (valuesCount: number, placesCount: number) => {
    const values = Array.from({ length: valuesCount }).map((_, index) => {
        const places = Array.from({ length: placesCount }).map((_, placeIndex) => {
            return `$${index * placesCount + placeIndex + 1}`;
        });

        const valuePlace = places.join(', ');

        return valuePlace;
    });

    return 
}

/* export const createOrder = async (order: OrderInput) => {
    const orders = await query<Pick<Order, 'id'>>(`
        INSERT INTO orders (user_id, sum_cost) VALUES ($1, $2) RETURNING *;
    `, ['0', '0']);

    const newOrderId = orders.rows[0].id;

    const products = await query(`
        INSERT INTO order_products (order_id, product_id, price, count) VALUES ${order.products.map((_, index, { length }) => `($${1 + index}, $${2 + index})${index + 1 < length ? ',' : ';'}`)}
    `, order.products.flatMap((product) => [product.id, product.count]));


} */