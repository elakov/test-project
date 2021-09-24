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

type ParametrizedQuery<T, Q> = {
    type: T,
    query: Q,
}

type ManyToOne<T> = T extends Array<infer I> ? I : T;

type IfArray<I, T, E> = I extends Array<any> ? T : E;

interface TypeExtractor<TT extends {}, R extends {} = {}> {
    content: R;
    add<T extends keyof TT>(name: T): TypeExtractor<Omit<TT, T>, R & Pick<TT, T>>
    add<T extends keyof TT, K extends TypeExtractor<any>>(name: T, builder: (extractor: TypeExtractor<ManyToOne<TT[T]>>) => K): TypeExtractor<Omit<TT, T>, R & {[name in T]: IfArray<TT[T], Array<K['content']>, K['content']> }>
}

type AC = Array<string | Record<string, AC>>;

export const createQueryCreator = <T extends {}>() => {
    type A = keyof T;


    class Builder {
        constructor(protected content: AC) {}

        add(name: string, builder: (extractor: Builder) => Builder) {
            if (builder) {
                return new Builder([
                    ...this.content,
                    { [name]: builder(new Builder([])).content }
                ])
            }

            return new Builder([...this.content, name]);
        }
    }

    const createQuery = <U extends TypeExtractor<any>>(builder: (builder: TypeExtractor<T>) => U): U['content'] => {
        const builded = builder(new Builder([]) as any as TypeExtractor<T>);

        return builded.content
    }

    return createQuery;
}


/**
 * build((b) => [
 *     b('products', (p) => [
 *          p('name')
 *          p('category')
 *      ])
 * ])
 * 
 * build((b) => b
 * .add('products', (p) => p
 *      .add('name')
 *      .add('price')
 *      .add('category', (c) => c.
 *          add('name')
 *      )
 * )
 * ))
 * 
 */