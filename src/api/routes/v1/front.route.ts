import * as express from "express"
import * as validate from "express-validation";
const router = express.Router();
const path = require("path")
import * as rq from "request-promise";
import * as cheerio from "cheerio";
import * as fs from "fs";

async function getVideo(url : string){
    // let url = "https://static.frontendmasters.com/assets/videos/promo/ATQQKEFHoh/720.webm"
    return await rq(url, {
        method : "get",
        headers : {
            "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding" : "gzip, deflate",
            "Connection" : "keep-alive",
            "Content-Type" : "video/webm"
        },
        encoding : null
    })
}

async function getSub(url : string){
    url = encodeURI(url)
    let body = await rq(url);
    let $ = cheerio.load(body);
    let vid = $(".EmbedContainer").html();
    console.log(vid)
    // let videoPath = $("video").attr("src");
    // console.log(videoPath)
    return "videoPath";
}

function saveData(data){
    try{
        let _path = path.join(__dirname, "video");
        let writeStream = fs.createWriteStream(_path+"/video.webm")
        writeStream.write(data, 'binary');
        writeStream.on('finish', () => {
            console.log('wrote all data to file');
        });
        writeStream.end();
        return true;
    }catch{
        throw new Error("Kaydedilemedi...")
    }
}

async function walk(){
    const baseUrl = "https://frontendmasters.com";
    const url = "https://frontendmasters.com/courses/api-design-nodejs-v3";

    let content = await rq(url);
    let $ = cheerio.load(content);

    let courseHeader = $("h1").html();
    let _path = path.join(__dirname, courseHeader)
    let coursePath = mkdirSync(_path);
    try {
        let contentArea = $("section.CourseToc");
        let cont = [];
        contentArea.find("ul.LessonList").each(function(index, elem){
            // cont.push($(elem).attr("href"));
            // return $(elem).html()
            // return $(elem).text()
            $(elem).find("li").each(function(i,e){
                let heading = $(e).find("h3").text();
                let desc = $(e).find(".description").text();
                let videoPath = $(e).find("a").attr("href");
                let _p = baseUrl+videoPath
                cont.push({
                    url :_p,
                    header : heading,
                    description : desc,
                    courseHeader : courseHeader
                });
            })
        })

        return cont;
    } catch (error) {
        console.log(error)
        return error
    }
}

const mkdirSync = function (dirPath) {
    try {
      fs.mkdirSync(dirPath)
    } catch (err) {
      if (err.code !== 'EEXIST') return dirPath
    }
  }

router
    .route("/")
    .get( async(req, res, next) => {
        try {
            // let data = await getVideo("");
            // saveData(data);
            let result : any[] = await walk();
            let videos = [];

            result.map(async (param) => {
                let _result = await getSub(param["url"]);
            })

            // for(var i=0;i<result.length;i++){
            //     let _result = await getSub(result[i]["url"]);
            //     videos.push(_result);
            // }

            res.send(result)
        } catch (err) {
            res.json("error")
        }
        
    })

module.exports = router;