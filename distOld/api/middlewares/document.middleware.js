"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
const Jimp = require("jimp");
const typeorm_1 = require("typeorm");
const document_model_1 = require("./../models/document.model");
const environment_config_1 = require("./../../config/environment.config");
const mime_type_enum_1 = require("./../enums/mime-type.enum");
const document_serializer_1 = require("./../serializers/document.serializer");
const base_middleware_1 = require("./base.middleware");
class DocumentMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super(new document_serializer_1.DocumentSerializer());
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
        this.create = (req, res, next) => {
            try {
                const documentRepository = typeorm_1.getRepository(document_model_1.Document);
                let document = new document_model_1.Document(req['file']);
                documentRepository.save(document);
                req['doc'] = document;
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
        this.resize = async (req, res, next) => {
            try {
                // If image optimization is activated and is image mime type
                if (environment_config_1.jimp.isActive === 1 && mime_type_enum_1.imageMimeTypes.lastIndexOf(req['file'].mimetype) !== -1) {
                    let destination = req['file'].destination;
                    // Read original file
                    const image = await Jimp.read(req['file'].path);
                    // Clone in 3 files according to 3 sizes
                    let xsImage = image.clone(), mdImage = image.clone(), xlImage = image.clone();
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
                }
                return next();
            }
            catch (e) {
                return next(Boom.expectationFailed(e.message));
            }
        };
    }
}
exports.DocumentMiddleware = DocumentMiddleware;
