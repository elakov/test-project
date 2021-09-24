import { FunctionComponent } from 'preact';
import './Catalog.css';

export const CatalogItem: FunctionComponent<{color?: string, selected: boolean, onClick?: () => void}> = ({ color, children, selected, onClick }) => <div
    class={selected ? "catalog_item selected" : "catalog_item"}
    style={{borderLeft: `2px ${color || 'transparent'} solid`}}
    children={children}
    onClick={onClick}
/>;