import { useState } from "react";
import { Link } from "react-router-dom";

function getColor($color) {
    return ["info", "danger"].includes($color) ? $color : "info";
}

function SidebarItem({ icon, target = "#", name, flag, flagColor }) {
    return (
        <li className="nav-item">
            <Link className="nav-link" to={target}>
                <svg className="nav-icon">
                    <use
                        xlinkHref={"/public/icons_basic.svg#cil-" + icon}
                    ></use>
                </svg>
                {name}
                {flag ? (
                    <span
                        className={
                            "badge badge-sm bg-" +
                            getColor(flagColor) +
                            " ms-auto"
                        }
                    >
                        {flag}
                    </span>
                ) : null}
            </Link>
        </li>
    );
}

function stringToHex(str) {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        let hexChar = str.charCodeAt(i).toString(16);
        hex += ("00" + hexChar).slice(-2); // adiciona um zero à esquerda, se necessário
    }
    return hex;
}
/**
 *
 * @param {{
 * items: {
 *  [categoryName: string]: ({
 *      icon: string,
 *      name: string,
 *      target: string,
 *      flag?: string,
 *      flagColor?: "info"|"danger"
 *  })[]
 * }} param0
 * @returns
 */
function SideBarContainer({ items = {}, isOpen }) {
    const _items = [];
    for (const key of Object.keys(Object.assign({}, items))) {
        if (!key.startsWith("_")) {
            _items.push(
                <li
                    className="nav-title"
                    key={"title_" + stringToHex(key.toLowerCase())}
                >
                    {key}
                </li>
            );
        }

        if (Array.isArray(items[key])) {
            for (const menuItem of items[key]) {
                _items.push(
                    <SidebarItem
                        icon={menuItem.icon}
                        target={menuItem.target}
                        name={menuItem.name}
                        flag={menuItem.flag}
                        flagColor={menuItem.flagColor}
                        key={`${stringToHex(key.toLowerCase())}_${stringToHex(
                            menuItem.target
                        )}`}
                    />
                );
            }
        }
    }
    return (
        <div
            className={
                "sidebar sidebar-dark sidebar-fixed" +
                (isOpen ? " toggled" : "")
            }
        >
            <div className="sidebar-header">Starlight</div>
            <ul className="sidebar-nav">{_items}</ul>
        </div>
    );
}

function ContentLayout({ children, setOpen, isOpen }) {
    return (
        <div className="wrapper">
            <div
                className="mobile-background-menu"
                onClick={() => setOpen(!isOpen)}
            ></div>
            <header className="header">
                <div
                    className="sidebar-toggle"
                    onClick={() => setOpen(!isOpen)}
                >
                    <i className="bx bx-menu" />
                </div>
            </header>
            <section className="website-content">{children}</section>
        </div>
    );
}

export function InternLayout({ children }) {
    const [isOpen, setOpen] = useState(
        localStorage.getItem("st_sidebar_open") === "open"
    );
    localStorage.setItem("st_sidebar_open", isOpen ? "open" : "closed");
    return (
        <>
            <SideBarContainer
                isOpen={isOpen}
                items={{
                    _initial: [
                        {
                            icon: "speedometer",
                            target: "/",
                            name: "Dashboard",
                        },
                    ],
                    Monitoramento: [
                        {
                            icon: "memory",
                            target: "/monitor/resources",
                            name: "Recursos",
                        },
                        {
                            icon: "cloud",
                            target: "/monitor/traffik",
                            name: "Trafégo",
                        },
                    ],
                    VPS: [
                        {
                            icon: "folder",
                            target: "/files",
                            name: "Editor de Arquivos",
                            flag: "BETA",
                        },
                        {
                            icon: "terminal",
                            target: "/terminal",
                            name: "Terminal",
                        },
                        {
                            icon: "shield-alt",
                            target: "/firewall",
                            name: "Firewall",
                        },
                        {
                            icon: "cloud-download",
                            target: "/packages",
                            name: "APT",
                        },
                    ],
                    Workspaces: [
                        {
                            icon: "spreadsheet",
                            target: "/workspace",
                            name: "Workspaces",
                        },
                        {
                            icon: "plus",
                            target: "/workspace/create",
                            name: "Criar Workspace",
                        },
                    ],
                    Configurações: [
                        {
                            icon: "cog",
                            target: "/settings",
                            name: "Configurações",
                        },
                        {
                            icon: "https",
                            target: "/settings/https",
                            name: "Certificado SSL",
                        },
                        {
                            icon: "beaker",
                            target: "/api_keys",
                            name: "API",
                        },
                    ],
                }}
            />
            <ContentLayout setOpen={setOpen} isOpen={isOpen}>
                {children}
            </ContentLayout>
        </>
    );
}
