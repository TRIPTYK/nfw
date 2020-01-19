import * as Boom from "@hapi/boom";
import * as Jimp from "jimp";
import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Document} from "../models/document.model";
import {DocumentSerializer} from "../serializers/document.serializer";
import {BaseMiddleware} from "./base.middleware";
import {ImageMimeTypes} from "../enums/mime-type.enum";
import EnvironmentConfiguration from "../../config/environment.config";



export class DocumentMiddleware extends BaseMiddleware {

    constructor() {
        super(new DocumentSerializer());
    }

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
    public create = (req: Request, res: Response, next) => {
        try {
            const documentRepository = getRepository(Document);
            const document = new Document(req["file"]);
            documentRepository.save(document);
            req["doc"] = document;
            return next();
        } catch (e) {
            return next(Boom.expectationFailed(e.message));
        }
    }

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
    public resize = async (req: Request, res: Response, next) => {
        const { jimp } = EnvironmentConfiguration.config;


        try {
            // If image optimization is activated and is image mime type
            if (jimp.isActive && req["file"].mimetype in ImageMimeTypes) {
                const {destination, path , filename} = req["file"];

                // Read original file
                    // @ts-ignore
                    const image = await Jimp.read(path);

                    // Clone in 3 files according to 3 sizes
                    const xsImage = image.clone();
                    const mdImage = image.clone();
                    const xlImage = image.clone();

                    // Resize and write file in server
                    xsImage
                        // @ts-ignore
                        .resize(JimpConfiguration.xs, Jimp.AUTO)
                        .writeAsync(`${destination}/xs/${filename}`);

                    mdImage
                        // @ts-ignore
                        .resize(JimpConfiguration.md, Jimp.AUTO)
                        .writeAsync(`${destination}/md/${filename}`);

                    xlImage
                        // @ts-ignore
                        .resize(JimpConfiguration.xl, Jimp.AUTO)
                        .writeAsync(`${destination}/xl/${filename}`);
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
}
