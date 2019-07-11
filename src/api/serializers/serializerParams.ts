import {Request} from "express"


/**
 *
 */
export class SerializerParams {


    /**
     * Pagination data
     */
    private paginationData: {
        total: number,
        request: Request
    } = {
        total: null,
        request: null
    };

    /**
     * Type for serializer
     */
    private type: string = null;


    /**
     *
     */
    public constructor() {

    }


    /**
     * Store data needed for pagination
     * @param request request object , used for links
     * @param total total records of the table
     */
    public enablePagination(request: Request, total: number): this {
        this.paginationData = {
            total,
            request
        };
        return this;
    }

    /**
     * Get pagination data
     */
    public getPaginationData(): { total: number, request: Request } {
        return this.paginationData;
    }


    /**
     * Check if pagination data has been set
     */
    public hasPaginationEnabled(): boolean {
        if (this.paginationData && this.paginationData.total && this.paginationData.request && this.paginationData.request.query.page && this.paginationData.request.query.page.number && this.paginationData.request.query.page.size)
            return true;
        else
            return false;
    }


    /**
     * Set type for serializer
     */
    public setType(serializerType: string): this {
        this.type = serializerType;
        return this;
    }


    /**
     * Get type for serializer
     */
    public getType(): string {
        return this.type;
    }
}
