import Boom from "@hapi/boom";
import { default as Axios } from "axios";
import * as Mailgun from "mailgun-js";
import { singleton } from "tsyringe";
import EnvironmentConfiguration from "../../config/environment.config";
import BaseService from "../../core/services/base.service";

// tslint:disable-next-line: interface-over-type-literal
type MailGunData = {
    attachment?: string;
    from?: string;
    subject?: string;
    template?: string;
    text?: string;
    to?: string;
    variables?: object;
    filename?: string;
};

@singleton()
export class MailService extends BaseService {
    public init() {
        return true;
    }
    /**
     * Sparkpost API
     */
    public async sendmailSparkpost(emailData: object): Promise<any> {

        const data = JSON.stringify(emailData);
        // 2. Send email to user with request_token, with a link to the "new password page [FRONT]"
        const options = {
            headers: {
                "Accept": "application/json",
                "Authorization": process.env.SPARKPOST_API_KEY,
                "Content-Length": Buffer.byteLength( data ),
                "Content-Type": "application/json"
            },
            host: "api.sparkpost.com",
            method: "POST",
            path: "/api/v1/transmissions",
            port: "443"
        };

        const axios = Axios.create(options as any);

        return new Promise((resolve, reject) => {
            axios.request({
                data,
                url: "https://" + options.host + options.path
            })
                .then((response) => {
                    const object =  {
                        data: response.data,
                        error: response.data.error || "",
                        message: response.data.message,
                        status: response.status
                    };
                    resolve(object);
                })
                .catch( ( error ) => {
                    const object =  {
                        error: error.message,
                        message: error.message,
                        status: 500,
                    };
                    reject(object);
                });
        });
    }

    /**
     * Mailgun API
     */
    public async sendmailGun(gunData: MailGunData, type: "attachment" | null): Promise<any> {
        const { mailgun : mailgunConf } = EnvironmentConfiguration.config;

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
