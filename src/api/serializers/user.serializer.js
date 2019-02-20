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
var UserSerializer = /** @class */ (function (_super) {
    __extends(UserSerializer, _super);
    function UserSerializer() {
        return _super.call(this, 'users', [
            'username',
            'email',
            'services',
            'documents',
            'firstname',
            'lastname',
            'role',
            'createdAt'
        ]) || this;
    }
    ;
    return UserSerializer;
}(base_serializer_1.BaseSerializer));
exports.UserSerializer = UserSerializer;
