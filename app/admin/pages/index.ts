import { history, router } from "../utils";
import { useEffect, useState } from "preact/hooks";
import { ComponentType, h } from "preact";
import { NewProductPage } from "./NewProduct/NewProduct";
import { ProductsPage } from "./Products/Products";
import { NewOrderPage } from "./NewOrder/NewOrder";

const pages = router.attach<ComponentType>({
    newProduct: NewProductPage,
    products: ProductsPage,
    newOrder: NewOrderPage,
})

const initialRoute = router.matchRoute(location.pathname);

export const ReactRouter = () => {
    const [route, setRoute] = useState(initialRoute.route);

    useEffect(() => {
        history.listen((url) => {
            console.log(url);
            setRoute(router.matchRoute(url).route);
        });
    }, [])

    const Page = pages[route];

    return h(Page, null);
}