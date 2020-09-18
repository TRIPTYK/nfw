export default interface SerializerInterface<T> {
    serialize(payload: T | T[],meta?: any): any;
    deserialize(payload: any): T | T[];
    serializeAsync(payload: T | T[],meta?: any): any;
    deserializeAsync(payload: any): T | T[];
    init();
}
