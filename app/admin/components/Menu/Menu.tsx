import './Menu.css';

const items = [
    { text: 'Новый заказ', imagePosition: '0 0'},
    { text: 'Заказы', imagePosition: '0 -18px'},
    { text: 'Справочники', imagePosition: '0 -36px', href: '/products' },
    { text: 'Склад', imagePosition: '0 -54px'},
]

export const Menu = () => {
    return <div class="menu">
        <ul>
            {items.map((item) => (<li>
                <a href={item.href || '#'}>
                    <div class="im" style={{ backgroundPosition: item.imagePosition }} />
                    {item.text}
                </a>
            </li>))}
        </ul>
    </div>
}