import "./component.scss";

export function Card({ header, children, className, bodyClass, headerClass }) {
    return <div className="card"></div>;
}

export function Widget({ color, title, text, icon }) {
    return (
        <div className="widget">
            <div className={"widget-icon bg-" + color}>
                <i className={"icon icon-xl " + (icon || "")} />
            </div>
            <div className="widget-body">
                <span>
                    {text ? (
                        <div className={"widget-text text-" + color}>
                            {text}
                        </div>
                    ) : null}
                    {title ? <div className="widget-title">{title}</div> : null}
                </span>
            </div>
        </div>
    );
}
