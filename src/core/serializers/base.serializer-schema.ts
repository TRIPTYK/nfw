export interface BaseSerializerSchemaInterface<T> {
    baseUrl: string;
    links(
        data: T,
        extraData: any,
        type: string
    ): {
        self?: string;
    };
    relationshipLinks(
        data: T,
        extraData: any,
        type: string,
        relationshipName: string
    ): {
        self?: string;
        related?: string;
    };
    relationshipMeta(
        data: T,
        extraData: any,
        type: string,
        relationshipName: string
    ): any;
    meta(data: T, extraData: any, type: string): any;
}

export default abstract class BaseSerializerSchema<T>
    implements BaseSerializerSchemaInterface<T> {
    public abstract get baseUrl();

    public links(data, extraData, type) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}`
        };
    }

    public relationshipLinks(data, extraData, type, relationshipName) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}/relationships/${relationshipName}`,
            related: `${this.baseUrl}/${type}/${data.id}/${relationshipName}`
        };
    }

    abstract meta(data: T, extraData: any, type: string);

    abstract relationshipMeta(
        data: T,
        extraData: any,
        type: string,
        relationshipName
    );
}
