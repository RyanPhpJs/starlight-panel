export function Crontrol({ children, className = null }) {
    return (
        <div className={"form-control " + (className ? className : null)}>
            {children}
        </div>
    );
}

export function FormControl({ children, className = null }) {
    return (
        <div className={"form-control " + (className ? className : null)}>
            {children}
        </div>
    );
}
