import Faker from "faker";
import { define } from "typeorm-seeding";
import { DocumentTypes } from "../api/enums/document-type.enum";
import { MimeTypes } from "../api/enums/mime-type.enum";
import { Document } from "../api/models/document.model";

define(Document, (faker: typeof Faker) => {
    const doc = new Document({
        fieldname: DocumentTypes.Document,
        filename: "file.png",
        originalname: "file-0.png",
        path: "/",
        mimetype: MimeTypes.TEXT,
        size: 1000
    });

    return doc;
});
