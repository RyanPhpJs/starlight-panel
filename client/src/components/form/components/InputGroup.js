import { FormControl } from "./Control";

export function InputGroupPrevious({
    placeholder,
    type,
    name,
    value,
    children
}) {
    return (
        <FormControl className="form-group">
            <span>{children}</span>
            <input
                type={type}
                name={name}
                className="form-field"
                value={value}
                placeholder={placeholder}
            />
        </FormControl>
    );
}

export function InputGroupNext({ type, name, value, children }) {
    return (
        <FormControl className="form-group">
            <input
                type={type}
                name={name}
                className="form-field"
                value={value}
            />
            <span>{children}</span>
        </FormControl>
    );
}
