import { Request } from '../Request';
import { Session } from '../Session/Session';
import { ResponseAwareEvent } from './ResponseAwareEvent';
export declare class RenderTemplateEvent extends ResponseAwareEvent {
    readonly options: any;
    readonly request: Request;
    readonly session: Session | undefined;
    readonly templateFile: string;
    readonly data: {
        [name: string]: any;
    };
    constructor(options: any, request: Request, session: Session | undefined, templateFile: string, data: {
        [name: string]: any;
    });
}
