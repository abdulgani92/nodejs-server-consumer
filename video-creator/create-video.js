const https = require('https');
const fs = require('fs');
var dir = './video';

exports.createVideo = function (videoUrl) {
    //Convert Video into Different Resolution and save into S3 Bucket

    return new Promise((resolve, reject)=>{
        if (videoUrl) {
            //Extracting details from URL
            const urlArray = videoUrl.split('/');
            const length = urlArray.length;
            const directory = urlArray[length - 2];
            const fileNameWithExt = urlArray[length - 1];
            const fileName = fileNameWithExt.split('.')[0];
            const ext = fileNameWithExt.split('.')[1];
    
            //Creating Object which will contails files details
            //Like,_fileName, _extention etc.
            const object = {};
            object['_fileName'] = fileName;
            object['_extension'] = ext;
            object['_directory'] = directory;
            object['_fileNameWithExtension'] = `${fileName}.${ext}`;
            object['_videoUrl'] = videoUrl;
    
            if (!fs.existsSync(`${dir}/${directory}/`)) {
                fs.mkdirSync(`${dir}/${directory}/`);
            }
    
            const file = fs.createWriteStream(`${dir}/${directory}/${fileName}.${ext}`);
            const request = https.get(videoUrl, function (response) {
                response.pipe(file);
                // console.log(file);
                return resolve(object);
            });
    
        } else {
            reject('Video URL is not valid');
        }
    })
}