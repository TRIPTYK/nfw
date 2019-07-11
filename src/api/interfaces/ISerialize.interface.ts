/**
 * Define required members for serialize middleware
 */
interface ISerialize {
    serializer;
    serialize: Function;
    deserialize: Function;
}

export {ISerialize};
