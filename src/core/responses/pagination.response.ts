import { PaginationParams } from "../serializers/base.serializer";
import Response from "./response.response";

export default class PaginationResponse extends Response {
    public paginationData: PaginationParams;

    public constructor(
        body: any,
        paginationData: PaginationParams,
        { status, type }: { status: number; type: string } = {
            status: 200,
            type: "application/vnd.api+json"
        }
    ) {
        super(body, { status, type });
        this.body = body;
        this.status = status;
        this.type = type;
        this.paginationData = paginationData;
    }
}
