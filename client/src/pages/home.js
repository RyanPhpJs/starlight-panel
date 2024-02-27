import { useEffect, useState } from "react";
import { DistroIcon } from "../components/distro_icon/component";
import { Card, Widget } from "../components/widgets/component";
import { getInfo } from "../lib/api";
import { PageContent } from "./layouts/Content";
import { Page } from "./layouts/Page";
import { parse, parseToGb } from "../lib/bytes";
import { LineChart } from "@mui/x-charts";

const formatTime = (d) => {
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};

export default class Home extends Page {
    async loader() {
        const response = await getInfo();
        return response.data;
    }
    content({ data }) {
        const [ramHistory, setRAMHistory] = useState([]);

        useEffect(() => {
            const ev = new EventSource("/api/info/memory/stream");
            ev.addEventListener("update_ram", (e) => {
                const d = JSON.parse(e.data);
                setRAMHistory(d);
            });
            return () => {
                ev.close();
            };
        }, []);

        const ramParsed = ramHistory.map((e) => parseToGb(e.value));
        const ramDates = ramHistory.map((e) => new Date(e.date));

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
                <PageContent.Col md={8}>
                    <Card.Minimizable
                        title={"Uso de RAM"}
                        padding="10px"
                        color="primary"
                    >
                        {ramParsed.length > 0 ? (
                            <LineChart
                                height={450}
                                series={[
                                    {
                                        label: "Uso de RAM",
                                        data: ramParsed,
                                        area: true,
                                        curve: "natural",
                                        valueFormatter: (v) => `${v} GB`,
                                        showMark: false,
                                        connectNulls: true,
                                    },
                                ]}
                                yAxis={[
                                    {
                                        id: "y-axis-id",
                                        min: 0,
                                        max: parseToGb(data.memory.total),
                                        valueFormatter: (v) => `${v} GB`,
                                    },
                                ]}
                                xAxis={[
                                    {
                                        id: "x-axis-default-id",
                                        data: ramDates,
                                        scaleType: "time",
                                        min: ramDates[0],
                                        max: ramDates[ramDates.length - 1],
                                        valueFormatter: (date) =>
                                            formatTime(date),
                                    },
                                ]}
                            />
                        ) : (
                            "Loading Chart..."
                        )}
                    </Card.Minimizable>
                </PageContent.Col>
                <PageContent.Col md={4}>
                    <Widget
                        title="Uso de RAM"
                        text={
                            ramHistory.length > 0
                                ? `${parse(
                                      ramHistory[ramHistory.length - 1].value
                                  )} / ${parse(data.memory.total)}`
                                : "Loading..."
                        }
                        icon={"fa-solid fa-memory"}
                        color={"primary"}
                    ></Widget>
                </PageContent.Col>
            </PageContent>
        );
    }
}
