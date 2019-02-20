"use strict";
exports.__esModule = true;
var Multer = require("multer");
var Boom = require("boom");
var mime_type_enum_1 = require("./../api/enums/mime-type.enum");
/**
 * Set Multer default configuration and file validation
 *
 * @inheritdoc https://www.npmjs.com/package/multer
 *
 * @param destination Directory where file will be uploaded
 * @param filesize Max file size authorized
 * @param filters Array of accepted mime types
 */
var set = function (destination, filesize, filters) {
    if (destination === void 0) { destination = './uploads/documents'; }
    if (filesize === void 0) { filesize = 1000000; }
    if (filters === void 0) { filters = mime_type_enum_1.mimeTypes; }
    // Define storage destination and filename strategy
    var storage = Multer.diskStorage({
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
                if (filters.filter(function (mime) { return file.mimetype === mime; }).length > 0) {
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
