export class User {
    id: number;
    name: string;
    authToken: string;
    constructor(name: string) {
        this.name = name;
    }
}
