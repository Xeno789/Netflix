let userRepo = require("./user").userRepo;
const admin = require("../helpers/admin").admin;

class Video{
    constructor(title, category, type){
        this.title = title;
        this.category = category;
        this.type = type;
    }
    updateVideo(category = undefined, type = undefined){
        if(category != undefined){
            this.category = category;
        }
        if(type != undefined){
            this.category = category;
        }
    }
}
class VideoRepository{
    constructor(){
        this.videos = [new Video("The Lord of the Rings", "Fun", "movie")]
    }
    findVideoByTitle(title){
        let foundVideo = this.videos.filter(video => video.title == title);
        if(foundVideo == []){
            return undefined;
        }
        return foundVideo[0];
    }
    deleteVideoByTitle(title){
        let index = this.videos.findIndex(video => video.title == title);
        if(index == -1){
            return undefined;
        }
        this.videos.splice(index, 1);
        return {"message": "Video deleted"}
    }
    addVideo(title, category, type){
        this.videos.push(new Video(title, category, type));
    }
}

let videoRepo = new VideoRepository();

function addVideoToQueue(req, res){
    let response = {"message": "Successfuly added."};
    let sessionId = parseInt(req.swagger.params.sessionId.value);
    let activeSessionIds = userRepo.getActiveSessionIds();
    if(activeSessionIds.includes(sessionId)){
        let video = videoRepo.findVideoByTitle(req.swagger.params.videoTitle.value)
        if(video == undefined){
            response = {"message": "Title not found"};
        }
        else{
            userRepo.getUserBySessionId(sessionId).addToQueue(video);
        }
    }
    else{
        response = {"message": "invalid session ID"};
    }
    res.json(response);
}
function videoByTitle(req, res){
    let response;
    let activeSessionIds = userRepo.getActiveSessionIds();
    if(activeSessionIds.includes(parseInt(req.swagger.params.sessionId.value))){
        response = videoRepo.findVideoByTitle(req.swagger.params.videoTitle.value);
        if(response == undefined){
            response = {"message": "Title not found"};
        }
    }
    else{
        response = {"message": "invalid session ID"};
    }
    res.json(response);
    return response;
}
function listVideosInQueue(req, res){
    let response;
    let sessionId = parseInt(req.swagger.params.sessionId.value)
    let activeSessionIds = userRepo.getActiveSessionIds();
    if(activeSessionIds.includes(sessionId)){
        response = userRepo.getUserBySessionId(sessionId).getQueue();
    }
    else{
        response = {"message": "invalid session ID"};
    }
    res.json(response);
}


function videoDatasByTitle(req, res){
    let response;
    if(checkIfAdminKeyIsValid(req.swagger.params.adminKey.value)){
        response = videoRepo.findVideoByTitle(req.swagger.params.videoTitle.value)
        if(response == undefined){
            response = {"message": "Title not found."}
        }

    }
    else{
        response = {"message": "invalid admin key"};
    }
    res.json(response);
}

function updateVideo(req, res){
    let response;
    if(checkIfAdminKeyIsValid(req.swagger.params.adminKey.value)){
        let body = req.swagger.params.body["value"];
        let video = videoRepo.findVideoByTitle(body.title);
        if(video == undefined){
            response = {"message": "Title not found"}
        }
        else{
            video.updateVideo(body.category, body.type);
            response = video;
        }
    }
    else{
        response = {"message": "invalid admin key"};
    }
    res.json(response);
}
function deleteVideoByTitle(req, res){
    let response;
    if(checkIfAdminKeyIsValid(req.swagger.params.adminKey.value)){
        response = videoRepo.deleteVideoByTitle(req.swagger.params.videoTitle.value);
        if(response == undefined){
            response = {"message": "Didnt find the given video title in the database."}
        }
    }
    else{
        response = {"message": "invalid admin key"};
    }
    res.json(response);
}
function addVideo(req, res){
    let response;
    if(checkIfAdminKeyIsValid(req.swagger.params.adminKey.value)){
        let body = req.swagger.params.body["value"];
        videoRepo.addVideo(body.title, body.category, body.type);
        response = {"message": "Video added"};
    }
    else{
        response = {"message": "invalid admin key"};
    }
    res.json(response);
}
function checkIfAdminKeyIsValid(adminKey){
    return parseInt(adminKey) == admin.adminKey;
}

module.exports = {
    addVideoToQueue: addVideoToQueue,
    videoByTitle: videoByTitle,
    listVideosInQueue: listVideosInQueue,
    videoDatasByTitle: videoDatasByTitle,
    updateVideo: updateVideo,
    deleteVideoByTitle: deleteVideoByTitle,
    addVideo: addVideo
}