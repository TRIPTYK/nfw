import Boom from '@hapi/boom';
import { BaseMiddleware } from "./base.middleware";
import { SettingSerializer } from "../serializers/setting.serializer";

/**
 * Middleware functions for setting
 *
 */
export class SettingMiddleware extends BaseMiddleware {
    /**
     * @description SettingMiddleware constructor
     *
     */
    constructor() {
        super( new SettingSerializer() );
    }
}
