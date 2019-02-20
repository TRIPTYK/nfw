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
var HttpStatus = require("http-status");
var Boom = require("boom");
var Fs = require("fs");
var document_model_1 = require("./../models/document.model");
var typeorm_1 = require("typeorm");
var document_repository_1 = require("./../repositories/document.repository");
var base_controller_1 = require("./base.controller");
/**
 *
 */
var DocumentController = /** @class */ (function (_super) {
    __extends(DocumentController, _super);
    /** */
    function DocumentController() {
        return _super.call(this) || this;
    }
    /**
     * Retrieve a list of documents, according to some parameters
     *
     * @param req Request
     * @param res Response
     * @param next Function
     *
     * @public
     */
    DocumentController.prototype.list = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var repository, documents, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        repository = typeorm_1.getCustomRepository(document_repository_1.DocumentRepository);
                        return [4 /*yield*/, repository.list(req.query)];
                    case 1:
                        documents = _a.sent();
                        res.json(documents.map(function (document) { return document.whitelist(); }));
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        next(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new document
     *
     * @param req Request
     * @param res Response
     * @param next Function
     *
     * @public
     */
    DocumentController.prototype.create = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var documentRepository, document_1;
            return __generator(this, function (_a) {
                try {
                    documentRepository = typeorm_1.getRepository(document_model_1.Document);
                    document_1 = new document_model_1.Document(req['file']);
                    documentRepository.save(document_1);
                    res.json(document_1.whitelist());
                }
                catch (e) {
                    next(Boom.expectationFailed(e.message));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Retrieve one document according to :documentId
     *
     * @param req Request
     * @param res Response
     * @param next Function
     *
     * @public
     */
    DocumentController.prototype.get = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var documentRepository, document_2, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        documentRepository = typeorm_1.getRepository(document_model_1.Document);
                        return [4 /*yield*/, documentRepository.findOneOrFail(req.params.documentId)];
                    case 1:
                        document_2 = _a.sent();
                        res.json(document_2.whitelist());
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        next(Boom.expectationFailed(e_2.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update one document according to :documentId
     *
     * @param req Request
     * @param res Response
     * @param next Function
     *
     * @public
     */
    DocumentController.prototype.update = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var documentRepository, document_3, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        documentRepository = typeorm_1.getRepository(document_model_1.Document);
                        return [4 /*yield*/, documentRepository.findOne(req.params.documentId)];
                    case 1:
                        document_3 = _a.sent();
                        if (req['file'].filename !== document_3.filename) {
                            Fs.unlink(document_3.path.toString(), function (err) {
                                if (err)
                                    throw Boom.expectationFailed(err.message);
                            });
                        }
                        documentRepository.merge(document_3, req['file']);
                        documentRepository.save(document_3);
                        res.json(document_3.whitelist());
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        next(Boom.expectationFailed(e_3.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete one document according to :documentId
     *
     * @param req Request
     * @param res Response
     * @param next Function
     *
     * @public
     */
    DocumentController.prototype.remove = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var documentRepository_1, document_4, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        documentRepository_1 = typeorm_1.getRepository(document_model_1.Document);
                        return [4 /*yield*/, documentRepository_1.findOne(req.params.documentId)];
                    case 1:
                        document_4 = _a.sent();
                        Fs.unlink(document_4.path.toString(), function (err) {
                            if (err)
                                throw Boom.expectationFailed(err.message);
                            documentRepository_1.remove(document_4);
                            res.sendStatus(HttpStatus.NO_CONTENT).end();
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        next(e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DocumentController;
}(base_controller_1.BaseController));
exports.DocumentController = DocumentController;
;
