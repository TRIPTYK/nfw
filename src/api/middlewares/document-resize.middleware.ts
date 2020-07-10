import * as Jimp from "jimp";
import {BaseMiddleware} from "../../core/middlewares/base.middleware";
import { Request , Response, NextFunction } from "express";
import {ImageMimeTypes} from "../enums/mime-type.enum";
import EnvironmentConfiguration from "../../config/environment.config";

export class DocumentResizeMiddleware extends BaseMiddleware {
    public use(req: Request, res: Response, next: NextFunction) {
        const { jimp } = EnvironmentConfiguration.config;

        try {
            // If image optimization is activated and is image mime type
            if (jimp.isActive && Object.values(ImageMimeTypes).includes(req.file.mimetype as any)) {
                const {destination, path , filename} = req.file;

                // Read original file
                Jimp.read(path).then((image) => {
                    // Clone in 3 files according to 3 sizes
                    const xsImage = image.clone();
                    const mdImage = image.clone();
                    const xlImage = image.clone();

                    // Resize and write file in server
                    xsImage
                        .resize(jimp.xs, Jimp.AUTO)
                        .writeAsync(`${destination}/xs/${filename}`);

                    mdImage
                        .resize(jimp.md, Jimp.AUTO)
                        .writeAsync(`${destination}/md/${filename}`);

                    xlImage
                        .resize(jimp.xl, Jimp.AUTO)
                        .writeAsync(`${destination}/xl/${filename}`);
                });
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }
}
