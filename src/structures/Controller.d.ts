import zod from "zod";
import * as Zod from "zod";
import { Request as WebRequest, Response, NextFunction } from "express";
import { Config } from "./config";
import SSE from "./SSE";
import Server from "./server";

type RemoveTail<
    S extends string,
    Tail extends string
> = S extends `${infer P}${Tail}` ? P : S;
type GetRouteParameter<S extends string> = RemoveTail<
    RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
    `.${string}`
>;

export interface ParamsDictionary {
    [key: string]: string;
}

// prettier-ignore
export type RouteParameters<Route extends string> = string extends Route ? ParamsDictionary
    : Route extends `${string}(${string}` ? ParamsDictionary // TODO: handling for regex parameters
    : Route extends `${string}:${infer Rest}` ?
            & (
                GetRouteParameter<Rest> extends never ? ParamsDictionary
                    : GetRouteParameter<Rest> extends `${infer ParamName}?` ? { [P in ParamName]?: string }
                    : { [P in GetRouteParameter<Rest>]: string }
            )
            & (Rest extends `${GetRouteParameter<Rest>}${infer Next}` ? RouteParameters<Next> : unknown)
    : {};

export const z = Zod;
export const zod = Zod;

type JsonAccepted =
    | string
    | number
    | boolean
    | null
    | { [k: string]: JsonAccepted }
    | JsonAccepted[];

class APIResponse {
    success(data: JsonAccepted): this;
    success(status: number, data: JsonAccepted): this;
    error(status: number, message: string): ThisParameterType;
}

export class Controller {
    server: Server;
    config: Config;

    request<
        K,
        M extends "GET" | "POST" | "DELETE" | "PUT" = "GET",
        U extends string = string
    >(
        options: {
            url: U;
            method: M;
            body: K;
            auth?: boolean;
        },
        callback: (
            req: WebRequest<
                RouteParameters<U>,
                any,
                M extends "GET"
                    ? {}
                    : M extends "DELETE"
                    ? {}
                    : zod.infer<zod.ZodObject<K, K>>,
                M extends "GET"
                    ? zod.infer<zod.ZodObject<K, K>>
                    : M extends "DELETE"
                    ? zod.infer<zod.ZodObject<K, K>>
                    : ParamsDictionary
            > & { config: Config },
            res: Response & {
                api: APIResponse;
                sse: SSE;
            },
            next: NextFunction
        ) => any
    ): this;

    // websocket force auth = true and method = GET
    websocket<U extends string = string>(url: U): this;
}
