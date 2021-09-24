-- CREATE "users" table if it is not exist
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'users'
            )
        THEN
            CREATE TABLE users
            (
                id         SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name  VARCHAR(50) NOT NULL
            );
        END IF;
    END
$$;

-- CREATE "profiles"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'profiles'
            )
        THEN
            CREATE TABLE profiles
            (
                id           SERIAL PRIMARY KEY,
                user_id      INTEGER,
                email        VARCHAR(100),
                phone_number VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        END IF;
    END
$$;

-- CREATE "categories"

DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
                AND table_name = 'categories'
            )
        THEN
            CREATE TABLE categories
            (
                id  SERIAL PRIMARY KEY,
                name VARCHAR(100)
            );
        END IF;
    END
$$;

-- CREATE "products"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'products'
            )
        THEN
            CREATE TABLE products
            (
                id   SERIAL PRIMARY KEY,
                category_id INTEGER,
                name        VARCHAR(100),
                price       DOUBLE PRECISION,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            );
        END IF;
    END
$$;

-- CREATE "orders"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'orders'
            )
        THEN
            CREATE TABLE orders
            (
                id       SERIAL PRIMARY KEY,
                user_id  INTEGER,
                sum_cost DOUBLE PRECISION,
                date     TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );
        END IF;
    END
$$;

-- CREATE "order_products"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'order_products'
            )
        THEN
            CREATE TABLE order_products
            (
                id         SERIAL PRIMARY KEY,
                order_id   INTEGER,
                product_id INTEGER,
                price      DOUBLE PRECISION,
                count      INTEGER,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
            );
        END IF;
    END
$$;

-- CREATE "archive_users"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM information_schema.tables
             WHERE table_schema = 'public'
               AND table_name = 'archive_users'
            )
        THEN
            CREATE TABLE archive_users
            (
                id         SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name  VARCHAR(50) NOT NULL
            );
        END IF;
    END
$$;

-- FILL "users" with fake data
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.users
             WHERE first_name = 'John'
               AND last_name = 'Doe'
            )
        THEN
            INSERT INTO public.users (first_name, last_name)
            VALUES ('John', 'Doe'),
                   ('John', 'Smith'),
                   ('Sam', 'Smith'),
                   ('Bruce', 'Wayne');
        END IF;
    END
$$;

-- FILL "profiles"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.profiles
             WHERE email = 'john.doe@gmail.com'
            )
        THEN
            INSERT INTO public.profiles (user_id, email, phone_number)
            VALUES (1, 'john.doe@gmail.com', '123-33-45-56'),
                   (2, 'john.smith@gmail.com', '234-55-10-11'),
                   (3, 'sam.smith@gmail.com', '345-30-11-22'),
                   (4, 'bruce.wayne@gmail.com', '123-11-22-33');
        END IF;
    END
$$;

-- FILL "categories"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.categories
             WHERE name = 'Салаты'
            )
        THEN
            INSERT INTO public.categories (name)
            VALUES ('Салаты'),
                   ('Вторые блюда'),
                   ('Гарниры'),
                   ('Напитки');
        END IF;
    END
$$;

-- FILL "products"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.products
             WHERE name = 'Винегрет'
            )
        THEN
            INSERT INTO public.products (name, price, category_id)
            VALUES ('Винегрет', 40.00, 1),
                   ('Селедка под шубой', 50.00, 1),
                   ('Мясо по французски', 90.00, 2),
                   ('Голубцы', 85.00, 2),
                   ('Картофельное пюре', 45.00, 3),
                   ('Гречка', 30.00, 3),
                   ('Компот', 40.00, 4),
                   ('Чай', 40.00, 4);
        END IF;
    END
$$;

-- FILL "orders"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.orders
             WHERE id = 2
               AND sum_cost = 45.6
            )
        THEN
            INSERT INTO public.orders (user_id, sum_cost, date)
            VALUES (1, 34, '2020-07-14 10:28:54.000000'),
                   (1, 45.6, '2020-06-17 13:20:25.000000'),
                   (2, 456.4, '2020-06-01 12:48:07.000000');
        END IF;
    END
$$;

-- FILL "order_products"
DO
$$
    BEGIN
        IF NOT EXISTS
            (SELECT 1
             FROM public.order_products
             WHERE id = 1
               AND order_id = 1
               AND product_id = 1
            )
        THEN
            INSERT INTO public.order_products (order_id, product_id, price, count)
            VALUES (1, 1, 40.00, 1),
                   (1, 2, 50.00, 1),
                   (1, 3, 90.00, 1),
                   (2, 4, 85.00, 1),
                   (2, 5, 45.00, 1),
                   (3, 6, 30.00, 1);
        END IF;
    END
$$;
