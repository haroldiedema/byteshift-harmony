import 'reflect-metadata';
declare type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
interface IRouteOptions {
    method?: MethodType | MethodType[];
}
export declare function Route(path: string, options?: IRouteOptions): (target: any, methodName: string, descriptor?: PropertyDescriptor) => void;
export {};
