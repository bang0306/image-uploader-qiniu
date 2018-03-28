const fs = require('fs');
const path = require('path');

let configLocal = {};
// const configString = null;

process.stdin.setEncoding('utf8');

function doConfig() {
    let cnt = 0;
    // console.log('配置一下吧[y/n]');
    process.stdin.on('data', (chunk) => {
        chunk = chunk.slice(0, -1);
        if (cnt === 0) {
            if (chunk === 'n') {
                process.stdin.emit('end');
            } else {
                cnt ++;
                console.log('accessKey:');
            }
        } else if (cnt === 1) {
            configLocal.accessKey = chunk;
            cnt ++;
            console.log('secretKey:');
        } else if (cnt === 2) {
            configLocal.secretKey = chunk;
            cnt ++;
            console.log('bucket:');
        } else if (cnt === 3) {
            configLocal.bucket = chunk;
            cnt ++;
            console.log('domain:');
        } else if (cnt === 4) {
            configLocal.urlDomain = chunk;
            cnt ++;
            console.log('server position: [0:华北 1:华东 2:华南 3:北美]');
        } else if (cnt === 5) {
            configLocal.serverPosition = chunk;
            cnt ++;
            fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(configLocal));
            console.log('已完成配置，开始愉快地贴图吧, 按e键开始使用');
            // process.stdin.emit('end');
        }
    })
}

doConfig();
