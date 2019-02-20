"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_serializer_1 = require("./base.serializer");
var DocumentSerializer = /** @class */ (function (_super) {
    __extends(DocumentSerializer, _super);
    function DocumentSerializer() {
        return _super.call(this, 'documents', [
            'fieldname',
            'filename',
            'path',
            'mimetype',
            'size',
            'user',
            'createdAt'
        ]) || this;
    }
    ;
    return DocumentSerializer;
}(base_serializer_1.BaseSerializer));
exports.DocumentSerializer = DocumentSerializer;
