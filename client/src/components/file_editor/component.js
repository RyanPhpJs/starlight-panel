import { useEffect, useState } from "react";

import "./component.scss";

/**
 *
 * @param {{ path: string, setPath: (str: string) => void}} param0
 * @returns
 */
export function FileEditorBreadcump({ path, setPath }) {
    const paths_list = path.split("/").filter((e) => e.length > 0);
    paths_list.unshift("/");
    const path_elements = [];
    const _param_path = [];
    for (let i = 0; i < paths_list.length; i++) {
        _param_path.push(paths_list[i]);
        const path = {
            name: paths_list[i],
            target: _param_path.join("/").replace(/\/\//g, "/"),
            active: i === paths_list.length - 1
        };
        path_elements.push(
            <a
                className={
                    "file_breadcrumbs_item" + (path.active ? " is-active" : "")
                }
                onClick={(e) => {
                    e.preventDefault();
                    if (!path.active) setPath(path.target);
                }}
                key={path.target}
            >
                {path.name}
            </a>
        );
    }

    return <nav className="file_breadcrumbs">{path_elements}</nav>;
}

export function FileEditor() {
    const [path, setPath] = useState("/home/starsbot");

    return (
        <div className="file-editor">
            <FileEditorBreadcump path={path} setPath={setPath} />
            <div>Path: {path}</div>
        </div>
    );
}
