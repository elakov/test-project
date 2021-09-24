import './Cells.css';

export const NameCell = (props: { data: string }) => {
    return <span class="link">{props.data}</span>
}

export const NumberCell = (props: { data: number }) => {
    return <span>{props.data}</span>
}
