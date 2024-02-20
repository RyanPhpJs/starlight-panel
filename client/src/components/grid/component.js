export function Row({ children }) {
    return <div className="row">{children}</div>;
}

export function Container({ children }) {
    return <Container.Fluid>{children}</Container.Fluid>;
}

Container.Fluid = function ContainerFluid({ children }) {
    return <div className="container-fluid">{children}</div>;
};

export function Col({
    sm = 0,
    md = 0,
    lg = 0,
    xl = 0,
    size = 0,
    className = "",
    children
}) {
    let class_list = String(className || "");
    if (size > 0) class_list += " col-" + size;
    if (sm > 0) class_list += " col-sm-" + sm;
    if (md > 0) class_list += " col-md-" + md;
    if (lg > 0) class_list += " col-lg-" + lg;
    if (xl > 0) class_list += " col-xl-" + xl;
    return <div className={class_list}>{children}</div>;
}
