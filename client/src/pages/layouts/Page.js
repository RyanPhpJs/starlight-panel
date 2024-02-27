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
    get ContentElement() {
        return this.content;
    }
    render(args = {}) {
        return (
            <Async
                promiseFn={this.loader.bind(this)}
                onReject={(err) => console.error(err)}
                {...args}
            >
                {({ isPending, error, data }) => {
                    if (isPending) {
                        const LoadingElement = this.loading;
                        return <LoadingElement />;
                    }
                    if (error) {
                        return <div>Error</div>;
                    }
                    const C = this.content;
                    return <this.ContentElement data={data} {...args} />;
                }}
            </Async>
        );
    }
}
