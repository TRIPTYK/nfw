import Boom from "@hapi/boom";
import * as Mailgun from "mailgun-js";
import BaseService from "../../core/services/base.service";
import { singleton, autoInjectable } from "tsyringe";
import ConfigurationService from "../../core/services/configuration.service";
import { ObjectLiteral } from "typeorm";

// tslint:disable-next-line: interface-over-type-literal
type MailGunData = {
    attachment?: string;
    from?: string;
    subject?: string;
    template?: string;
    text?: string;
    to?: string;
    variables?: ObjectLiteral;
    filename?: string;
};

@singleton()
@autoInjectable()
export class MailService extends BaseService {
    public constructor(private configurationService: ConfigurationService) {
        super();
    }

    public init() {
        return true;
    }

    /**
     * Mailgun API
     */
    public async sendmailGun(gunData: MailGunData, type: "attachment" | null): Promise<any> {
        const { mailgun : mailgunConf } = this.configurationService.config;

        const mailgun: Mailgun = new Mailgun({
            apiKey : mailgunConf.privateKey,
            domain : mailgunConf.domain,
            host : mailgunConf.host,
            publicApiKey : mailgunConf.publicKey,
            timeout : 2000
        });

        if (!gunData) {
            return Boom.badRequest("Payload cannot be empty");
        }


        let data = {
            attachment: null,
            from : gunData.from,
            subject : gunData.subject,
            template: gunData.template,
            text : gunData.text,
            to : gunData.to
        };


        if (gunData.variables) {
            const dataMerged = { ...data, ...gunData.variables };
            data = dataMerged;
        }

        if (type === "attachment") {
            const attch = new mailgun.Attachment({data: gunData.attachment, filename: gunData.filename});
            data.attachment = attch;
        }

        return new Promise((res, rej) => {
            mailgun.messages().send(data, (error, body) => {
                if (error) { rej(error); }
                res(body);
            });
        });
    }
}
