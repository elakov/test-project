import { FunctionComponent, RenderableProps, JSX } from 'preact';
import './Design.css';

export const Section: FunctionComponent = ({ children }) => <div class="section" children={children} />;

export const SectionHead: FunctionComponent = ({ children }) => <div class="section_head" children={children} />;

export const SectionBody: FunctionComponent = ({ children }) => <div class="section_body" children={children} />;

export const Catalog = {
    Catalog: ({ children }: RenderableProps<{}>) => <div class="catalog" children={children} />,
    LeftMenu: ({ children }: RenderableProps<{}>) => <div class="catalog_left-menu" children={children} />,
    Body: ({ children }: RenderableProps<{}>) => <div class="catalog_body" children={children} />,
}

export const Wait: FunctionComponent = ({ children }) => <div class="wait"><div class="wait_content">{children}</div></div>;

export const Button: FunctionComponent<{ onClick?: () => void }> = ({ children, onClick }) => <div class="btn grey" onClick={onClick} children={children} />;
export const SaveButton: FunctionComponent<{ onClick?: () => void }> = ({ children, onClick }) => <div class="btn save" onClick={onClick} children={children} />;

export const Select: FunctionComponent<{ onChange?: JSX.GenericEventHandler<HTMLSelectElement>}> = ({ children, onChange }) => <select class="select" children={children} onChange={onChange} />;

export const Input: FunctionComponent<JSX.HTMLAttributes<HTMLInputElement>> = (props) => <input class="input" {...props} />;
