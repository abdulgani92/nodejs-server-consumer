var FFmpeg = require('fluent-ffmpeg');

exports.convertVideo = function (video, resolution) {
    return new Promise((resolve, reject) => {

        var command = FFmpeg({ source: `./video/${video._directory}/${video._fileNameWithExtension}` })
            .withSize(`${resolution}x?`)
            .on('start', function (commandLine) {
                // The 'start' event is emitted just after the FFmpeg
                // process is spawned.
                console.log('Spawned FFmpeg with command: ' + commandLine);
            })
            .on('codecData', function (data) {
                console.log('Input is ' + data.audio + ' audio with ' + data.video + ' video');
            })
            .on('progress', function (progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('error', function (err) {
                // The 'error' event is emitted when an error occurs,
                // either when preparing the FFmpeg process or while
                // it is running
                console.log('Cannot process video: ' + err.message);
                reject(err);
            })
            .on('end', function () {
                // The 'end' event is emitted when FFmpeg finishes
                // processing.
                console.log(`Processing finished successfully ${resolution}`);
                resolve(`Processing finished successfully ${resolution}`);
            })
            .saveToFile(`./video/${video._directory}/${resolution}.${video._extension}`);
    })
}




