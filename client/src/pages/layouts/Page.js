import { Component } from "react";
import { Async, useAsync } from "react-async";
import { Loading } from "../../components/loading/component";

export class Page extends Component {
    loading() {
        return <Loading.Intern />;
    }
    async loader() {
        return {};
    }
    render(args = {}) {
        return (
            <Async promiseFn={this.loader.bind(this)} {...args}>
                {({ isPending, error, data }) => {
                    if (isPending) {
                        const LoadingElement = this.loading;
                        return <LoadingElement />;
                    }
                    if (error) {
                        return <div>Error</div>;
                    }
                    return this.content({ ...args, data: data });
                }}
            </Async>
        );
    }
}
