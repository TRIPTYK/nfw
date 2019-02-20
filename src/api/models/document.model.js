"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var user_model_1 = require("./user.model");
var DateUtils_1 = require("typeorm/util/DateUtils");
var mime_type_enum_1 = require("./../enums/mime-type.enum");
var document_type_enum_1 = require("./../enums/document-type.enum");
var document_serializer_1 = require("./../serializers/document.serializer");
var Document = /** @class */ (function () {
    /**
     * @param payload Object data to assign
     */
    function Document(payload) {
        Object.assign(this, payload);
    }
    Document.prototype.whitelist = function () {
        return new document_serializer_1.DocumentSerializer().serializer.serialize(this);
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Document.prototype, "id");
    __decorate([
        typeorm_1.Column({
            type: "enum",
            "enum": document_type_enum_1.documentTypes
        })
    ], Document.prototype, "fieldname");
    __decorate([
        typeorm_1.Column()
    ], Document.prototype, "filename");
    __decorate([
        typeorm_1.Column()
    ], Document.prototype, "path");
    __decorate([
        typeorm_1.Column({
            type: "enum",
            "enum": mime_type_enum_1.mimeTypes
        })
    ], Document.prototype, "mimetype");
    __decorate([
        typeorm_1.Column({
            type: String
        })
    ], Document.prototype, "size");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_model_1.User; }, function (user) { return user.documents; }, {
            onDelete: "CASCADE" // Remove all documents when user is deleted
        })
    ], Document.prototype, "user");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": DateUtils_1.DateUtils.mixedDateToDateString(new Date())
        })
    ], Document.prototype, "createdAt");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": null
        })
    ], Document.prototype, "updatedAt");
    __decorate([
        typeorm_1.Column({
            type: Date,
            "default": null
        })
    ], Document.prototype, "deletedAt");
    Document = __decorate([
        typeorm_1.Entity()
    ], Document);
    return Document;
}());
exports.Document = Document;
