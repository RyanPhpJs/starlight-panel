import { DistroIcon } from "../components/distro_icon/component";
import { Widget } from "../components/widgets/component";
import { getInfo } from "../lib/api";
import { PageContent } from "./layouts/Content";
import { Page } from "./layouts/Page";

export default class Home extends Page {
    async loader() {
        const response = await getInfo();
        return response.data;
    }
    content({ data }) {
        return (
            <PageContent rows={true}>
                <PageContent.Col md={4}>
                    <Widget
                        title="Sistema Operacional"
                        text={data.distro}
                        icon={DistroIcon.Raw(data.distro)}
                        color={DistroIcon.Color(data.distro)}
                    ></Widget>
                </PageContent.Col>
                <PageContent.Col md={4}>
                    <Widget
                        title="Docker Version"
                        text={data.docker.version}
                        icon={"fa-brands fa-docker"}
                        color={"docker"}
                    ></Widget>
                </PageContent.Col>
                <PageContent.Col md={4}>
                    <Widget
                        title="Node.JS Version"
                        text={data.node.version}
                        icon={"fa-brands fa-node-js"}
                        color={"nodejs"}
                    ></Widget>
                </PageContent.Col>
            </PageContent>
        );
    }
}
