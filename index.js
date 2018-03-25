#!/usr/bin/env electron
const { Readable } = require('stream');
const qiniu = require('qiniu');
const {app, clipboard } = require('electron');
const fs = require('fs');

const initSuccessMsg = '启动成功，按r键把剪切板里的图片上传到七牛云里吧，按q键退出';

function getServerPosition(code) {
    switch (code) {
        // 华东
        case '0':
            return qiniu.zone.Zone_z0;
        // 华北
        case '1':
            return qiniu.zone.Zone_z1;
        // 华南
        case '2':
            return qiniu.zone.Zone_z2;
        // 北美
        case '3':
            return qiniu.zone.Zone_na0;
        default:
            console.log('找不到你配置的服务器区域代码');

    }
}
// should generated to upload image
var mac = null;
var uploadToken = null;
var formUploader = null;
var putExtra = null;
var domain = '';
function qiniuInit(accessKey, secretKey, bucket, urlDomain, serverPosition) {
    domain = urlDomain;
    mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: bucket,
      callbackBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
      callbackBodyType: 'application/json'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    uploadToken=putPolicy.uploadToken(mac);
    var config = new qiniu.conf.Config();
    config.zone = getServerPosition(serverPosition);
    formUploader = new qiniu.form_up.FormUploader(config);
    putExtra = new qiniu.form_up.PutExtra();
}



function uploadImg(key, readableStream) {
    formUploader.putStream(uploadToken, key, readableStream, putExtra, function(respErr,
        respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                console.log(`上传成功，地址是：${domain}/${key}`);
                const mdText = `![](${domain}/${key})`;
                clipboard.writeText(mdText);
                console.log(`${mdText} 已经被复制，可以直接粘贴到你的markdown中`);
                // console.log(respBody);
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
}



function doUpload() {
    const image = clipboard.readImage();
    if (image.isEmpty()) {
        console.log('貌似剪切板里没有图片啊');
        return;
    }
    const imgBuf = image.toPNG();
    const imageStream = new Readable();
    imageStream.push(imgBuf);
    imageStream.push(null);
    const key = Math.random().toString(36).substr(2) + '.png';
    uploadImg(key, imageStream);
}


app.on('ready', function() {
    process.stdin.setEncoding('utf8');
    process.stdin.on('end', function() {
        console.log('工具已退出');
        app.quit();
    });

    try {
        let {
            accessKey,
            secretKey,
            bucket,
            urlDomain,
            serverPosition
        } = require('./config.json');
        qiniuInit(accessKey, secretKey, bucket, urlDomain, serverPosition);
        console.log(initSuccessMsg);
    } catch (e) {
        console.log('还没有配置，[n]取消，任意键继续');
        require('./setup');
    }


    process.stdin.on('data', function(chunk) {

        if (chunk === 'e\n') {
            let {
                accessKey,
                secretKey,
                bucket,
                urlDomain,
                serverPosition
            } = require('./config.json')
            qiniuInit(accessKey, secretKey, bucket, urlDomain, serverPosition);
            console.log(initSuccessMsg);
        }
        if (chunk === 'r\n') {
            doUpload();
        } else if (chunk === 'q\n') {
            process.stdin.emit('end')
        } else if (chunk === 'c\n') {
            doConfig();
        }
    })
})
