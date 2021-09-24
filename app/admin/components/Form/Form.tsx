import { FunctionComponent } from "preact"
import "./Form.css";

export const createForm = (widthLabel: number, widthControl?: number) => {
    const Form: FunctionComponent = ({children}) => <div class="form" children={children} />
    const Row: FunctionComponent = ({children}) => <div class="form_row" children={children} />
    const Label: FunctionComponent = ({children}) => <div class="form_label" style={{width: widthLabel}}  children={children} />
    const Control: FunctionComponent = ({children}) => <div class="form_control" style={{width: widthControl}} children={children} />

    return {
        Form,
        Row,
        Label,
        Control, 
    }
}