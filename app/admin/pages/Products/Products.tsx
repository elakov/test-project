import { useState } from 'preact/hooks';
import { CatalogItem } from '../../components/Catalog/Catalog';
import { SectionHead, Catalog, Section, Wait, Button } from '../../components/Design/Design';
import { PlusIcon } from '../../components/Design/Icons';
import { NameCell, NumberCell } from '../../components/Table/Cells';
import { createTable } from '../../components/Table/Table';
import { useQuery } from '../../hooks/useQuery';
import { history, router } from '../../utils';

const ProductsTable = createTable([
    { name: 'Наименование', dataComponent: NameCell, width: 250 },
    { name: 'Цена', dataComponent: NumberCell },
    { name: 'Арт.', dataComponent: NumberCell },
])

type Response = {
    categories: {
        name: string;
        products: {
            name: string;
            price: number;
        }[]
    }[]
}

export const ProductsPage = () => {
    const [selected, setSelected] = useState(0);
    const {
        data,
        fetching
    } = useQuery<Response>(`
        query {
            categories {
                name
                products {
                    name
                    price
                }
            }
        }
    `);

    if (!data) {
        return <Wait>Загрузка...</Wait>
    }

    const selectedCategory = data.categories[selected];

    return <Section>
        <SectionHead><h2>Товары</h2></SectionHead>
        <Catalog.Catalog>
            <Catalog.LeftMenu>
                {(data.categories || []).map((category, index) => (<CatalogItem
                    selected={index===selected}
                    color="#96d2f5"
                    onClick={() => setSelected(index)}
                >
                    {category.name}
                </CatalogItem>))}
            </Catalog.LeftMenu>
            <Catalog.Body>
                <h2>{selectedCategory.name} <Button onClick={() => history.navigate(router.generatePath('newProduct'))}><PlusIcon />Новый товар</Button></h2>
                <ProductsTable data={selectedCategory.products.map((product) => ([product.name, product.price, 0]))} />
            </Catalog.Body>
        </Catalog.Catalog>
        {fetching && <Wait>Загрузка...</Wait>}
    </Section>
}