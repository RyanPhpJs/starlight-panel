import { Form } from "../components/form/component";
import { Page } from "./layouts/Page";

import "../styles/login.scss";
import { redirectFromLogin, setToken } from "../lib/auth";
import { Loading } from "../components/loading/component";

export default class Login extends Page {
    loading() {
        return <Loading />;
    }
    content() {
        return (
            <div className="login-container">
                <div className="login_card">
                    <div className="left-card-content">
                        <h3>Starlight Panel</h3>
                        <Form
                            onSubmit={async ({ form, setError, api }) => {
                                const username = String(
                                    form.get("username") || ""
                                );
                                const password = String(
                                    form.get("password") || ""
                                );
                                if (username.trim().length < 1) {
                                    return setError(
                                        "Username precisa ser informado"
                                    );
                                }
                                if (password.trim().length < 1) {
                                    return setError(
                                        "Senha precisa ser informada"
                                    );
                                }
                                setError(null);
                                const response = await api.loginUser(
                                    username,
                                    password
                                );
                                if (response.success) {
                                    setToken(response.token);
                                    redirectFromLogin();
                                } else {
                                    setError(response.message);
                                }
                            }}
                            className="st-form-wrapper"
                        >
                            <div className="st-form-input">
                                <div className="st-form-input-icon">
                                    <div className="fa-solid fa-user"></div>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Usúario"
                                />
                            </div>
                            <div className="st-form-input">
                                <div className="st-form-input-icon">
                                    <div className="fa-solid fa-lock"></div>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Senha"
                                />
                            </div>
                            <input
                                className="btn btn-info btn-block"
                                type="submit"
                                value="Acessar"
                            />
                        </Form>
                    </div>
                    <div className="right-card-content">
                        <div className="right-data">
                            <h3>Starlight Panel</h3>
                            <p>Paínel de controle intuitivo para sua VPS</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
