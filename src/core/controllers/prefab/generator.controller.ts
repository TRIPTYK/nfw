/* eslint-disable arrow-body-style */
import BaseController from "../base.controller";
import { Controller, Post } from "../../decorators/controller.decorator";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("generate")
export default class GeneratorController extends BaseController {
    @Post("entity")
    public generateEntity() {
        return true;
    }
}

