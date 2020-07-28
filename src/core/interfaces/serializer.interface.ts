export default interface SerializerInterface<T> {
    serialize(payload: T | T[],meta?: object): any;
    deserialize(payload: any): T | T[];
    serializeAsync(payload: T | T[],meta?: object): any;
    deserializeAsync(payload: any): T | T[];
}
