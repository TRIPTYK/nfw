import ControllerInterface from "../interfaces/controller.interface";
import { ApplicationRegistry } from "../application/registry.application";

export default abstract class BaseController implements ControllerInterface {
    public name: string;

    public constructor() {
        ApplicationRegistry.registerController(this);
        this.name = Reflect.getMetadata("routeName", this);
    }

    public init() {
        // eslint-disable-next-line no-useless-return
        return;
    }
}
