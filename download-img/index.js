const request = require('request')
const fs = require('fs')
const path = require('path')

const pathResolve = (pathname) => { return path.resolve(__dirname, pathname) }

function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false
}

let downloadOneImg = async (url, filePath) => {
    return new Promise(resolve => {
        let stream = request(url).pipe(
            fs.createWriteStream(filePath)
        )
        stream.on('finish', function () {
            resolve()
        })
    })
}

async function downloadUrl(urlList, dir) {
    let startTime = new Date().getTime()
    for (let i = 0, len = urlList.length; i < len; i++) {
        let url = urlList[i]
        const last = url.lastIndexOf('/')
        const name = url.substr(last + 1)
        const dirPath = `./public/${dir}`
        mkdirSync(dirPath)
        let filePath = `${dirPath}/${name}.jpg`
        // request(url).pipe(fs.createWriteStream(filePath))
        let a = await downloadOneImg(url, filePath)
        console.log(`${name}.jpg 下载完成，存放目录${dirPath}`)
    }
    let countTime = (new Date().getTime() - startTime) / 1000
    console.log(`本次下载图片${urlList.length}张，共用时${countTime}秒`)
}

let imgData = fs.readFileSync(pathResolve('./imgUrl.json'), 'utf-8')
imgData = JSON.parse(imgData)

let urlList1 = []
let urlList2 = []

imgData.forEach(item => {
    if (item.image_type === '二维码\/条形码') {
        urlList1.push(item.imgurl)
    } else if (item.image_type === '酒瓶背标(瓶口\/瓶底\/包装)') {
        urlList2.push(item.imgurl)
    }
})

fs.writeFileSync(pathResolve('./urlList1.json'), JSON.stringify(urlList1), 'utf-8')
fs.writeFileSync(pathResolve('./urlList2.json'), JSON.stringify(urlList2), 'utf-8')


downloadUrl(urlList1, 'urlList1')
downloadUrl(urlList2, 'urlList2')
