import * as Boom from "boom";
import {default as Axios} from "axios";
import {Request} from "express";
import * as Mailgun from "mailgun-js";

const _getError = (error) => {

    let message = 'An error as occured';

    if (error['code'] !== undefined && typeof (error.code) !== 'undefined' && error.code === 'ECONNREFUSED') {
        message = 'Connection with mail API refused. Please check administrator.';
    } else if (typeof (error.response.data) !== 'undefined' && typeof (error.response.data.statusCode) !== 'undefined') {
        message = error.response.data.message;
    }

    return message;
};

/**
 * Contact Triptyk API mail about email sending
 *
 * @description Must be used as a called service. If you wish send an email before/after another action, you should use the associate middleware and place it on your route.
 *
 * @param req Request
 *
 * @inheritdoc https://github.com/TRIPTYK/api-mail
 */
const sendmail = async (req: Request) => {

    const data = req.body;

    if (!data) {
        return Boom.badRequest('Payload cannot be empty');
    }

    if (!data.mail_type) {
        return Boom.badRequest('Payload type value is required');
    }

    data.api_id = process.env.MAIL_API_ID;

    const api = `${process.env.MAIL_API_ROUTE}${data.mail_type}`;

    return new Promise(function (resolve, reject) {

        Axios({
            method: 'post',
            url: api,
            data: data
        })
            .then(function (response) {
                let object = {
                    'message': response.data.message,
                    'error': response.data.error || '',
                    'data': response.data,
                    'status': response.status
                };
                resolve(object);
            })
            .catch((response) => {
                let content = _getError(response);
                let object = {
                    'message': content,
                    'error': content,
                    'status': 500
                };
                reject(object);
            });
    });

};


/**
 * Mailgun API
 */
const sendmailGun = async (req: Request) => {
    const mailgun: Mailgun = new Mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        publicApiKey: process.env.MAILGUN_PUBLIC_KEY,
        host: process.env.MAILGUN_HOST,
        domain: process.env.MAILGUN_DOMAIN,
        timeout: 2000
    });

    if (!req.body) {
        return Boom.badRequest('Payload cannot be empty');
    }

    const data = {
        from: "Mailgun Sandbox <postmaster@sandboxcd6790cbfc4b402ba15d6eb8d92b8a9d.mailgun.org>",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };

    return new Promise((res, rej) => {
        mailgun.messages().send(data, function (error, body) {
            if (error) rej(error);
            res(body);
        });
    });
};

export {sendmail};
