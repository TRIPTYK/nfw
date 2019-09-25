import * as Boom from "boom";
import { default as Axios } from "axios";
import { Request, Response } from "express";
import * as Mailgun from "mailgun-js";

const _getError = (error) => {

    let message = 'An error as occured';

    if(error['code'] !== undefined && typeof(error.code) !== 'undefined' && error.code === 'ECONNREFUSED') {
        message = 'Connection with mail API refused. Please check administrator.';
    }
    else if(typeof(error.response.data) !== 'undefined' && typeof(error.response.data.statusCode) !== 'undefined') {
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

    return new Promise(function(resolve, reject) {

        Axios({
            method: 'post',
            url: api,
            data: data
        })
            .then( function(response) {
                let object =  {
                    'message': response.data.message,
                    'error': response.data.error || '',
                    'data': response.data,
                    'status': response.status
                };
                resolve(object);
            })
            .catch( ( response ) => {
                let content = _getError(response);
                let object =  {
                    'message': content,
                    'error': content,
                    'status': 500
                };
                reject(object);
            });
    });

};

/**
 * Sparkpost API
 */
/*const sendmailSparkpost = async (emailData : Object) => {

    const data = JSON.stringify(emailData);
    //2. Send email to user with request_token, with a link to the "new password page [FRONT]"
    const options = {
        host: 'api.sparkpost.com',
        port: '443',
        path: '/api/v1/transmissions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': process.env.SPARKPOST_API_KEY,
            'Content-Length': Buffer.byteLength( data )
        }
    };

    const axios = await Axios.create(options);

    return new Promise(function(resolve, reject) {

        axios.request({
            url: 'https://' + options.host + options.path,
            data: data
        })
            .then( function(response) {
                let object =  {
                    'message': response.data.message,
                    'error': response.data.error || '',
                    'data': response.data,
                    'status': response.status
                };
                resolve(object);
            })
            .catch( ( response ) => {
                let content = _getError(response);
                let object =  {
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
const sendmailGun = async (req : Request, gunData, type) => {
    const mailgun : Mailgun = new Mailgun({
        apiKey : process.env.MAILGUN_API_KEY,
        publicApiKey : process.env.MAILGUN_PUBLIC_KEY,
        host : process.env.MAILGUN_HOST,
        domain : process.env.MAILGUN_DOMAIN,
        timeout : 2000
    });

    if (!gunData) {
        return Boom.badRequest('Payload cannot be empty');
    }


    let data = {
        from : "Mailgun Sandbox <postmaster@sandboxcd6790cbfc4b402ba15d6eb8d92b8a9d.mailgun.org>",
        to : gunData.to,
        subject : gunData.subject,
        text : gunData.text,
        template: gunData.template,
        attachment: null
    };


    if(gunData.variables){
        let dataMerged = { ...data, ...gunData.variables };
        data = dataMerged;
    }

    if(type == "attachment"){
        var attch = new mailgun.Attachment({data: gunData.attachment, filename: gunData.filename});
        data.attachment = attch;
    }

    return new Promise((res,rej) => {
        mailgun.messages().send(data, function (error, body) {
            if (error) rej(error);
            res(body);
        });
    });
};

export { sendmail, /*sendmailSparkpost,*/ sendmailGun };
