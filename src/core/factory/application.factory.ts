import { Type } from "../types/global";
import { container } from "tsyringe";

export default class ApplicationFactory {
    public static create(application: Type<any>): any {
        const controllers: Type<any>[] = Reflect.getMetadata("controllers", application);
        const providers: Type<any>[] = Reflect.getMetadata("providers", application);

        for (const provider of providers) {
            container.register(provider, provider);
        }

        const instance = new application(controllers);
        return instance;
    }
}
