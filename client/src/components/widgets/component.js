import { useState } from "react";
import "./component.scss";

export function Card({ color, title, children, padding = "20px" }) {
    const HeaderEl = title ? (
        <div className="card-header">
            <span>{title}</span>
        </div>
    ) : null;
    return (
        <div className={"card border-top-" + color}>
            <HeaderEl />
            <div className="card-body maximized" style={{ padding: padding }}>
                {children}
            </div>
        </div>
    );
}

Card.Minimizable = function CardMinimizable({
    color,
    title,
    children,
    padding = "20px",
}) {
    const [isOpen, setOpen] = useState(true);
    return (
        <div className={"card border-top-" + color}>
            <div className="card-header">
                <span>{title}</span>
                <span>
                    <span
                        className="button-action"
                        onClick={(e) => setOpen(!isOpen)}
                    >
                        <i
                            className={
                                "fa-solid fa-" +
                                (isOpen ? "window-minimize" : "window-maximize")
                            }
                        ></i>
                    </span>
                </span>
            </div>
            <div
                className={"card-body" + (isOpen ? " maximized" : "")}
                style={{ padding: padding }}
            >
                {children}
            </div>
        </div>
    );
};

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
