`use strict`;
const request = require(`request`);
const hostname = "db-api";
function addVideoToQueue(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/Video`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const videoResponse = json.find((video) => video.title == req.swagger.params.videoTitle.value);
            if(videoResponse === undefined){
                res.json({"error": "Video not found"});
                return;
            }
            request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 200){
                    const json = JSON.parse(body);
                    const userResponse = json.find((user) => user.username == req.get('X-consumer-username'));

                    const url = `http://${hostname}:3001/api/v1/User/${userResponse._id}`;
                    let queue = userResponse.queue;
                    queue.push(videoResponse)
                    request.patch({url: url, json:{"queue": queue},},function(err, httpResponse, body){
                        if (!err && httpResponse.statusCode == 200){
                            res.json({"message": "Successfully added."});
                            return;
                        }
                        res.json({"message": "Unexpected error"});
                        return;
                    });
                }
            })
        }
    });
}
function videoByTitle(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/Video`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const userResponse = json.find((video) => video.title == req.swagger.params.videoTitle.value);
            if(userResponse === undefined){
                res.json({"error": "Video not found"});
                return;
            }
            res.json(userResponse);
            return;
        }
        res.json({"error": "Unexpected error"});
        return;
    })
}
function listVideosInQueue(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/User`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const userResponse = json.find((user) => user.username == req.get('X-consumer-username'));
            request.get({url:`http://${hostname}:3001/api/v1/User/${userResponse._id}`}, async function(err, httpResponse, body){
                res.json(JSON.parse(body).queue);
            });
        }
    })
}

function getVideos(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/Video`}, async function(err, httpResponse, body){
        res.json(JSON.parse(body));
    });
}

function updateVideo(req, res){
    let apiRequestBody = req.swagger.params.body["value"];
    request.get({url:`http://${hostname}:3001/api/v1/Video`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const videoResponse = json.find((video) => video.title == apiRequestBody.title);
            request.patch({url:`http://${hostname}:3001/api/v1/Video/${videoResponse._id}`, json:{"category": apiRequestBody.category, "type": apiRequestBody.type}},async function(err, httpResponse, body){
                res.json(body);
                return;
            });
        }
        else{
            res.json({"error": "Unexpected error"});
            return;
        }
    })
}
function deleteVideoByTitle(req, res){
    request.get({url:`http://${hostname}:3001/api/v1/Video`}, async function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 200){
            const json = JSON.parse(body);
            const videoResponse = json.find((video) => video.title == req.swagger.params.videoTitle.value);
            if(videoResponse === undefined){
                res.json({"error": "Video not found"});
                return;
            }
            request.delete({url:`http://${hostname}:3001/api/v1/Video/${videoResponse._id}`},async function(err, httpResponse, body){
                if (!err && httpResponse.statusCode == 204){
                    res.json({"message": "Video deleted"});
                    return;
                }
            });
        }
        else{
            res.json({"error": "Unexpected error"});
            return;
        }
    })
}
function addVideo(req, res){
    let body = req.swagger.params.body["value"];
    request.post({url:`http://${hostname}:3001/api/v1/Video`, json:{title: body.title, category: body.category, type: body.type}}, function(err, httpResponse, body){
        if (!err && httpResponse.statusCode == 201){
            res.json(body);
            return;
        }
        res.json({"error":"Title already exists."});
    });
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