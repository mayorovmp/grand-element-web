export class Envelope<T> {
    data: T;
    success: boolean;
    message: string;
    code: string;
}
