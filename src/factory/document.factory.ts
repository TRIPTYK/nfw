import { define } from "typeorm-seeding";
import Faker from "faker";
import { Document } from "../api/models/document.model";
import { DocumentTypes } from "../api/enums/document-type.enum";
import { MimeTypes } from "../api/enums/mime-type.enum";

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
