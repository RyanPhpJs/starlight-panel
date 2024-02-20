import { useEffect } from "react";
import { Spinner } from "../spinner/component";

export function Loading() {
    useEffect(() => {
        document.querySelector("#loading-wrapper").classList.add("show");
        return () => {
            document.querySelector("#loading-wrapper").classList.remove("show");
        };
    });
    return <div></div>;
}

Loading.Intern = function Intern() {
    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Spinner.Primary></Spinner.Primary>
        </div>
    );
};
