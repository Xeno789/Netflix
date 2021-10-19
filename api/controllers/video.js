'use strict';
const mongoose = require('mongoose');
const Video = require('../models/video');
const User = require('../models/user');

function addVideoToQueue(req, res){
    Video.findOne({title: req.swagger.params.videoTitle.value})
    .exec()
    .then(async(video) => {
        console.log(video)
        if(video === null){
            res.json({"message": "Video not found"});
        }
        else{
            await User.updateOne({sessionId: req.headers.session_key}, { $push: { queue: video } })
            res.json({"message": "Successfully added."});
        }
    })
}
function videoByTitle(req, res){
    Video.findOne({title: req.swagger.params.videoTitle.value})
    .exec()
    .then(async(video) => {
        if(video === null){
            res.json({"error": "Video not found"});
        }
        else{
            res.json(video); 
        }
    })
    .catch(err => {
        res.json({"error": "Video not found"});
    });
}
function listVideosInQueue(req, res){
    User.findOne({sessionId: req.headers.session_key})
    .exec()
    .then(user =>{
        console.log(user.queue)
        res.json(user.queue);
    })
    .catch(err =>{
        res.json({"error": err});
    })
}

function getVideos(req, res){
    Video.find()
    .exec()
    .then(videos =>{
        res.json(videos);
    })
    .catch(err =>{
        res.json({"error": err});
    })
}

function updateVideo(req, res){
    let updateOps = {}
    let body = req.swagger.params.body["value"];
    if(body.category != undefined){
        updateOps["category"] = body.category;
    }
    if(body.type != undefined){
        updateOps["type"] = body.type;
    }
    Video.updateOne({title: body.title}, { $set: updateOps})
    .exec()
    .then(result =>{
        if(result.modifiedCount){
            res.json({"message": "Successfully updated."});
        }
        else{
            res.json({"error": "Video not found or nothing changed."});
        }
    })
    .catch(err =>{
        res.json({"error": "Video not found"});
    })
}
function deleteVideoByTitle(req, res){
    Video.deleteOne({title: req.swagger.params.videoTitle.value})
    .exec()
    .then(result =>{
        if(result.deletedCount){
            res.json({"message": "Video deleted"});
        }
        else{
            res.json({"message": "Didnt find the given video title in the database."});
        }
    })
}
function addVideo(req, res){
    let body = req.swagger.params.body["value"];
    const video = new Video({
        _id : mongoose.Types.ObjectId(),
        title: body.title,
        category: body.category,
        type: body.type,
        });
    video.save().then(result => {
        res.json(video);
    })
    .catch(err => {
        res.json({"error": "Title already in use"});
    })
}


module.exports = {
    addVideoToQueue: addVideoToQueue,
    videoByTitle: videoByTitle,
    listVideosInQueue: listVideosInQueue,
    updateVideo: updateVideo,
    deleteVideoByTitle: deleteVideoByTitle,
    addVideo: addVideo,
    getVideos: getVideos
}