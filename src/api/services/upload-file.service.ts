const Boom = require("boom");
const mkdirp = require('async-mkdirp');
const fs = require('fs');

module.exports = async (req, h) => {
    
    var date = new Date();
    var d = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    let filename = req.payload['file[]'].hapi.filename;
    let data = req.payload['file[]']._data;
    var fName = filename.split(".");
    var ext = fName[fName.length - 1];
    let folder = 'reference';
    let fileName = req.payload.type;
    if(req.payload.type == 'logo'){
        folder = 'team';
        fileName = 'logo-'+d;
    }

    if(req.payload.type == 'uploaded_map'){
        req.payload.type = 'map';
        fileName = 'map';
    }

    if(req.payload.type == 'uploaded_picture'){
        req.payload.type = 'picture';
        fileName = 'picture';
    }

    if(req.payload.type == 'uploaded_contract'){
        req.payload.type = 'contract';
        fileName = 'contract';
    }


    if(req.payload.type == 'assignment_contract'){
        req.payload.type = 'contract';
        fileName = 'contract';
        folder = "reference/assignment";
    }
    

    var dir = 'files/' + folder + '/' + req.payload.refId + '/' + req.payload.type;

    var pathUrl = dir + '/' + fileName +'.'+ext;
    
    await mkdirp(dir);

    return new Promise(function(resolve, reject) {
        fs.writeFile(pathUrl, new Buffer(data), function (err) {
            if (err) {
                console.log(err);
            } else {
                resolve({
                    'message': 'file saved',
                    'path': pathUrl,
                    'statut': '200'
                });
            }
        });
    });
};