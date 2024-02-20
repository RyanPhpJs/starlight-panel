import { Col, Container, Row } from "../../components/grid/component";

function PageContentLayout({ paddingSize, children }) {
    return (
        <div
            className="bootstrap-wrapper"
            style={{ padding: `${paddingSize}px` }}
        >
            {children}
        </div>
    );
}

export function PageContent({
    children,
    paddingSize = 20,
    grid = false,
    rows = false
}) {
    if (grid || rows) {
        if (grid) {
            return (
                <PageContentLayout paddingSize={paddingSize}>
                    <Container.Fluid>
                        <Row>
                            <Col size={12}>{children}</Col>
                        </Row>
                    </Container.Fluid>
                </PageContentLayout>
            );
        }
        return (
            <PageContentLayout paddingSize={paddingSize}>
                <Container.Fluid>
                    <Row>{children}</Row>
                </Container.Fluid>
            </PageContentLayout>
        );
    }
    return (
        <PageContentLayout paddingSize={paddingSize}>
            {children}
        </PageContentLayout>
    );
}

PageContent.Row = Row;
PageContent.Col = Col;
PageContent.Container = Container;
