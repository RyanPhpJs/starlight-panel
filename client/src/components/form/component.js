import React, { useState } from "react";
import "./component.scss";
import * as api from "../../lib/api";
/**
 *
 * @param {{
 *    onSubmit: (e: {
 *      form: FormData,
 *      event: React.FormEvent<HTMLFormElement>,
 *      setError: (error: string | null) => any,
 *      error: string | null,
 *      api: import("../../lib/api")
 * }) => any
 * }} param0
 * @returns
 */
export function Form({ onSubmit, children, ...args }) {
    const [error, setError] = useState(null);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formEl = new FormData(e.currentTarget);

                onSubmit({ form: formEl, event: e, setError, error, api });
            }}
            {...args}
        >
            {error ? <div className="alert danger-alert">{error}</div> : null}
            {children}
        </form>
    );
}
