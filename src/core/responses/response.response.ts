export default class Response {
    public type: string;
    public status: number;
    public body: any;

    public constructor(
        body: any,
        { status, type }: { status: number; type: string } = {
            status: 200,
            type: "application/vnd.api+json"
        }
    ) {
        this.body = body;
        this.status = status;
        this.type = type;
    }
}
