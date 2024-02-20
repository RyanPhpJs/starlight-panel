import React, { lazy, useContext, useEffect, useState, Suspense } from "react";
import { UserContext } from "./context/user";
import { getInitialUser } from "./lib/api";
import { InternLayout } from "./layouts/intern";
import { Loading } from "./components/loading/component";
import {
    BrowserRouter,
    Route,
    Routes,
    useLoaderData,
    useNavigate,
    useParams
} from "react-router-dom";

import "./styles/app.scss";

const HomePage = lazy(() => import("./pages/home"));
const FilesPage = lazy(() => import("./pages/files"));
const LoginPage = lazy(() => import("./pages/login"));

function ToLogin() {
    console.log("redirecting to login");
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    });
    return <Loading key={"loading"} />;
}

function WebPage({ element }) {
    const params = useParams();

    return React.createElement(element, { params: params });
}

function AppModule() {
    const [user, setUser] = useContext(UserContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        getInitialUser()
            .then((res) => {
                if (res.status === 401) {
                    // user not authenticated
                    setUser({ authenticated: false, user: null });
                } else {
                    setUser({ authenticated: true, user: res.data });
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (user) {
        if (user.authenticated) {
            return (
                <BrowserRouter>
                    <InternLayout>
                        <Suspense
                            fallback={<Loading.Intern text="Loading Page..." />}
                        >
                            <Routes>
                                <Route path="/" element={<HomePage />}></Route>
                                <Route
                                    path="/files"
                                    element={<FilesPage />}
                                ></Route>
                            </Routes>
                        </Suspense>
                    </InternLayout>
                </BrowserRouter>
            );
        }
        return (
            <Suspense fallback={<Loading key="loading" />}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />}></Route>
                        <Route path="*" element={<ToLogin />}></Route>
                    </Routes>
                </BrowserRouter>
            </Suspense>
        );
    }

    return <Loading />;
}

export function Application() {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={[user, setUser]}>
            <AppModule />
        </UserContext.Provider>
    );
}
