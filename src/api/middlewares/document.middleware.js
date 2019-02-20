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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Boom = require("boom");
var Jimp = require("jimp");
var typeorm_1 = require("typeorm");
var document_model_1 = require("./../models/document.model");
var environment_config_1 = require("./../../config/environment.config");
var mime_type_enum_1 = require("./../enums/mime-type.enum");
var document_serializer_1 = require("./../serializers/document.serializer");
var base_middleware_1 = require("./base.middleware");
/**
 *
 */
var DocumentMiddleware = /** @class */ (function (_super) {
    __extends(DocumentMiddleware, _super);
    function DocumentMiddleware() {
        var _this = _super.call(this, new document_serializer_1.DocumentSerializer()) || this;
        /**
         * Create Document and append it to req
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         *
         * @returns {Function}
         *
         * @public
         *
         */
        _this.create = function (req, res, next) {
            try {
                var documentRepository = typeorm_1.getRepository(document_model_1.Document);
                var document_1 = new document_model_1.Document(req['file']);
                documentRepository.save(document_1);
                req['doc'] = document_1;
                return next();
            }
            catch (e) {
                return next(Boom.expectationFailed(e.message));
            }
        };
        /**
         * Resize image according to .env file directives
         *
         * @param {Object} req
         * @param {Object} res
         * @param {Function} next
         *
         * @returns {Function}
         *
         * @public
         *
         */
        _this.resize = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var destination, image, xsImage, mdImage, xlImage, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(environment_config_1.jimp.isActive === 1 && mime_type_enum_1.imageMimeTypes.lastIndexOf(req['file'].mimetype) !== -1)) return [3 /*break*/, 2];
                        destination = req['file'].destination;
                        return [4 /*yield*/, Jimp.read(req['file'].path)];
                    case 1:
                        image = _a.sent();
                        xsImage = image.clone(), mdImage = image.clone(), xlImage = image.clone();
                        // Resize and write file in server
                        xsImage
                            .resize(environment_config_1.jimp.xs, Jimp.AUTO)
                            .write(destination + '/xs/' + req['file'].filename, function (err, doc) {
                            if (err)
                                throw Boom.expectationFailed(err.message);
                        });
                        mdImage
                            .resize(environment_config_1.jimp.md, Jimp.AUTO)
                            .write(destination + '/md/' + req['file'].filename, function (err, doc) {
                            if (err)
                                throw Boom.expectationFailed(err.message);
                        });
                        xlImage
                            .resize(environment_config_1.jimp.xl, Jimp.AUTO)
                            .write(destination + '/xl/' + req['file'].filename, function (err, doc) {
                            if (err)
                                throw Boom.expectationFailed(err.message);
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/, next()];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, next(Boom.expectationFailed(e_1.message))];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return DocumentMiddleware;
}(base_middleware_1.BaseMiddleware));
exports.DocumentMiddleware = DocumentMiddleware;
