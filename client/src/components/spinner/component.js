export function Spinner({ color }) {
    return (
        <span className={"spinner spinner-" + (color || "transparent")}></span>
    );
}

Spinner.Danger = function SpinnerRed() {
    return <Spinner color="danger" />;
};
Spinner.Transparent = function SpinnerTransparent() {
    return <Spinner color="transparent" />;
};
Spinner.Success = function SpinnerSuccess() {
    return <Spinner color="success" />;
};
Spinner.Primary = function SpinnerPrimary() {
    return <Spinner color="primary" />;
};
