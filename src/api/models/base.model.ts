export abstract class BaseModel {
    public constructor(payload: Object = {}) {
        Object.assign(this, payload);
    }
}