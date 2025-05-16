
export class Alert {
    id?: string;
    type?: AlertType;
    message?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}

export * from './alert';