"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const mime_type_enum_1 = require("./../enums/mime-type.enum");
const document_type_enum_1 = require("./../enums/document-type.enum");
const document_serializer_1 = require("./../serializers/document.serializer");
let Document = class Document {
    /**
     * @param payload Object data to assign
     */
    constructor(payload) { Object.assign(this, payload); }
    /**
     * @return Serialized user object in JSON-API format
     */
    whitelist() {
        return new document_serializer_1.DocumentSerializer().serializer.serialize(this);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Document.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: document_type_enum_1.documentTypes
    }),
    __metadata("design:type", String)
], Document.prototype, "fieldname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Document.prototype, "path", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: mime_type_enum_1.mimeTypes
    }),
    __metadata("design:type", String)
], Document.prototype, "mimetype", void 0);
__decorate([
    typeorm_1.Column({
        type: String
    }),
    __metadata("design:type", Object)
], Document.prototype, "size", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_model_1.User, user => user.documents, {
        onDelete: "CASCADE" // Remove all documents when user is deleted
    }),
    __metadata("design:type", user_model_1.User)
], Document.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        nullable: true
    }),
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        default: null
    }),
    __metadata("design:type", Date)
], Document.prototype, "deletedAt", void 0);
Document = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Object])
], Document);
exports.Document = Document;
