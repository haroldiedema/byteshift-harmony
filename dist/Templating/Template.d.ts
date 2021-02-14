export declare function Template(name: string, options?: {
    [name: string]: any;
}): (target: any, methodName: string, descriptor?: PropertyDescriptor) => void;
export interface ITemplate {
    /**
     * The name of the template.
     */
    name: string;
    /**
     * An options object passed to any subscribed render template event.
     */
    options?: any;
}
