export default class RelationshipNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}
