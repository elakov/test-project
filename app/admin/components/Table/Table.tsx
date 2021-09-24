import { ComponentType } from "preact";
import './Table.css';

type ColumnDescription<D> = {
    name: string;
    width?: number;
    dataComponent: ComponentType<{data: D}>
}

type Head<T extends readonly ColumnDescription<any>[]> = T extends readonly [infer U, ...unknown[]] ? U : void;

type Tail<T extends readonly ColumnDescription<any>[]> = T extends readonly [any, ...infer U] ? U : void;


// @ts-expect-error
type ExtractDataFromColumns<C extends readonly ColumnDescription<any>[], T extends any[] = []> = Head<C> extends ColumnDescription<infer U> ? ExtractDataFromColumns<Tail<C>, [...T, U]> : T;

export const createTable = <T extends ColumnDescription<any>[]>(columnDescriptions: [...T]) => {

    return (props: { data: ExtractDataFromColumns<T>[] }) => {
        return (<table class="table" cellSpacing={0}>
            <thead>
                <tr>
                    {columnDescriptions.map(({ name, width }) => (<th width={width} class="table_title-cell">{name}</th>))}
                </tr>
            </thead>
            <tbody>
                {props.data.map((row) => (<tr>
                    {(row as any[]).map((item, index) => {
                        const { dataComponent: Component } = columnDescriptions[index];
                        return (<td class="table_row-cell">
                            <Component data={item} />
                        </td>)
                    })}
                </tr>))}
            </tbody>
        </table>)
    }
}
