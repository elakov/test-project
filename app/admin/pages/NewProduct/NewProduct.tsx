import { useEffect, useState } from "preact/hooks";
import { Input, SaveButton, Section, SectionBody, SectionHead, Select, Wait } from "../../components/Design/Design"
import { createForm } from "../../components/Form/Form"
import { useMutation } from "../../hooks/useMutation";
import { useQuery } from "../../hooks/useQuery";
import { history, router } from "../../utils";

const Form = createForm(130, 260);

type Response = {
    categories: {
        id: number;
        name: string;
    }[]
}

export const NewProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState<number>(null);
    const { data, fetching } = useQuery<Response>(`query {
        categories {
            id
            name
        }
    }`);

    const craeteProduct = useMutation(`mutation CreateProduct($product: ProductInput) {
        createProduct(product: $product) {
            id
            name
        }
    }`, { product: {name, price, categoryId: category }}, () => {
        history.navigate(router.generatePath('products'));
    })

    useEffect(() => {
        if (!category && data) {
            setCategory(data.categories[0].id);
        }
    }, [data, category]);



    if (fetching) {
        return <Wait>Загрузка...</Wait>
    }

    return <Section>
        <SectionHead><h2>Новый товар <SaveButton onClick={() => craeteProduct()}>Сохранить</SaveButton></h2></SectionHead>
        <SectionBody>
            <Form.Form>
                <Form.Row>
                    <Form.Label>Категория</Form.Label>
                    <Form.Control><Select onChange={(event) => setCategory(Number(event.currentTarget.value))}>{data.categories.map(({ id, name }) => <option key={id} selected={id === category} children={name} value={id}  />)}</Select></Form.Control>
                </Form.Row>
                <Form.Row>
                    <Form.Label>Название</Form.Label>
                    <Form.Control><Input value={name} onChange={(event) => setName(event.currentTarget.value)} /></Form.Control>
                </Form.Row>
                <Form.Row>
                    <Form.Label>Цена</Form.Label>
                    <Form.Control><Input value={price} type="number" onChange={(event) => setPrice(parseInt(event.currentTarget.value))} /></Form.Control>
                </Form.Row>
            </Form.Form>
        </SectionBody>
    </Section>
}