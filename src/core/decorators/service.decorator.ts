import { container } from "tsyringe";
import { MulterService } from "../../api/services/multer.service";
import { Type } from "../types/global";

/**
 * 
 * @param serviceClass Service class
 */
export function service(serviceClass: Type<any>): PropertyDecorator {
    return function(target: object, propertyKey: string | symbol) {
        target[propertyKey] = container.resolve(MulterService);
    };
}
