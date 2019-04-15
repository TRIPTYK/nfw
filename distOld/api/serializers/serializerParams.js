"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class SerializerParams {
    /**
     *
     */
    constructor() {
        /**
         * Pagination data
         */
        this.paginationData = {
            total: null,
            request: null
        };
        /**
         * Type for serializer
         */
        this.type = null;
    }
    /**
     * Store data needed for pagination
     * @param request request object , used for links
     * @param total total records of the table
     */
    enablePagination(request, total) {
        this.paginationData = {
            total,
            request
        };
        return this;
    }
    /**
     * Get pagination data
     */
    getPaginationData() {
        return this.paginationData;
    }
    /**
     * Check if pagination data has been set
     */
    hasPaginationEnabled() {
        if (this.paginationData && this.paginationData.total && this.paginationData.request && this.paginationData.request.query.page && this.paginationData.request.query.number)
            return true;
        else
            return false;
    }
    /**
     * Set type for serializer
     */
    setType(serializerType) {
        this.type = serializerType;
        return this;
    }
    /**
     * Get type for serializer
     */
    getType() {
        return this.type;
    }
}
exports.SerializerParams = SerializerParams;
