"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_serializer_1 = require("./base.serializer");
class RouteSerializer extends base_serializer_1.BaseSerializer {
    constructor() {
        super('routes', RouteSerializer.withelist);
    }
}
RouteSerializer.withelist = ['methods', 'path'];
exports.RouteSerializer = RouteSerializer;
