"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Multer = require("multer");
const Boom = require("boom");
const mime_type_enum_1 = require("./../api/enums/mime-type.enum");
/**
 * Set Multer default configuration and file validation
 *
 * @inheritdoc https://www.npmjs.com/package/multer
 *
 * @param destination Directory where file will be uploaded
 * @param filesize Max file size authorized
 * @param filters Array of accepted mime types
 */
const set = (destination = './dist/uploads/documents', filesize = 1000000, filters = mime_type_enum_1.mimeTypes) => {
    // Define storage destination and filename strategy
    let storage = Multer.diskStorage({
        destination: function (req, file, next) {
            next(null, destination);
        },
        filename: function (req, file, next) {
            next(null, file.originalname + '-' + Date.now());
        }
    });
    // Return configured multer instance, with size and file type rejection
    return Multer({
        storage: storage,
        limits: {
            fileSize: filesize // In bytes = 0,95367 Mo
        },
        fileFilter: function (req, file, next) {
            try {
                if (filters.filter(mime => file.mimetype === mime).length > 0) {
                    return next(null, true);
                }
                return next(Boom.unsupportedMediaType('File mimetype not supported'), false);
            }
            catch (e) {
                next(Boom.expectationFailed(e.message));
            }
        }
    });
};
exports.set = set;
