var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = require('../model/user.js');
var verifyToken = require('../auth/verifyToken.js');
var cors = require('cors');
const game = require('../model/game.js');
const category = require('../model/category')
var reviews = require("../model/reviews");
const fileUpload = require('express-fileupload');
const fileType = require('file-type');
app.options('*', cors());
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(fileUpload({ createParentPath: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(urlencodedParser);

app.get("/category", (req, res) => {
    category.getCat((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/games/:platform", (req, res) => {
    var platform = req.params.platform;
    game.getGamesByPlatform(platform, (error, results) => {
        if (error) {
            res.status(500).json({ Condition: "Unknown Error" });
        } else {
            res.status(200).send(results);
        }
    });
});

//get reviews
app.get("/game/:id/review/", (req, res) => {
    var gameid = req.params.id;
    reviews.getReviewByGameid(gameid, (error, results) => {
        if (error) {
            res.status(500).json({ Condition: "Unknown Error" });
        } else {
            res.status(200).send(results);
        }
    });
});

//add review
app.post('/user/:uid/game/:gid/review', verifyToken, function (req, res) {
    var role = req.role;
    console.log(role.toUpperCase())
    if (role.toUpperCase() == "CUSTOMER") {
        var userid = req.params.uid;
        var gameid = req.params.gid;
        if (isNaN(parseInt(userid)) && isNaN(parseInt(gameid))) {
            res.status(422).json({ message: `userid ${userid} is not a number or gameid ${gameid} is not a number` })
        } else {
            reviews.addReview(userid, gameid, req.body, function (err, result) {
                if (err) {
                    res.status(500).json({ Condition: "Unknown Error" });
                } else if (result == "invalid") {
                    res.status(422).json({ message: "The game does not exist" })
                } else {
                    res.status(201).json({ reviewid: result });
                }
            })
        }
    }else {
        res.status(403).json({ message: "This account is Forbidden to Make Review!" })
    }

});

//add category
app.post("/category", verifyToken, (req, res) => {
    // if(req.role == "admin") {
    var role = req.role;
    if (role == "Admin") {
        category.addCategory(req.body, (error, result) => {
            if (error) {
                res.status(500).json({ Condition: "Unknown Error" });
            } else if (result == "taken") {
                res.status(422).json({ message: "The category name provided already exists" });
            } else {
                res.status(204).send("");
            }
        });
    } else {
        res.status(401).json({ message: "Cannot Create!" })
    }

    // }else {
    //     res.status.apply(401).json({message: "Not authorized"})
    // }

});


//file upload
app.post('/fileupload', async (req, res) => {
    try {
        if (!req.files) {
            console.log("No file")
            res.send({
                status: false,
                message: 'No file uploaded'

            });
        } else {
            let pic = req.files.pic;
            if (((await fileType.fromBuffer(pic.data)).mime !== "image/jpeg") || (pic.size > 1 * 1024 * 1024)) {
                console.log("File not jpeg format or file too big.");
                res.status(413).type('json').send(`{"message":"File not jpeg format or file too big"}`);
            } else {
                pic.mv('./public/' + pic.name);
                console.log(`File ${pic.name} size ${pic.size} is uploaded`);
                res.status(201).type('json').send(`{"message": "File ${pic.name} size ${pic.size} is uploaded"}`);
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//edit game endpoint
app.put('/game/:id/', function (req, res) {
    var gameid = req.params.id;
    if (isNaN(parseInt(gameid))) {
        res.status(422).json({ message: `id ${gameid} is not a number` })
    } else {
        game.editGame(gameid, req.body, function (err, result) {
            if (err) {
                res.status(500).json({ Condition: "Unknown Error" });
            } else if (result == "invalid") {
                res.status(422).json({ message: "The game does not exist" })
            } else if (result == "existed") {
                res.status(422).json({ Condition: "The game is already existed" });
            } else {
                res.status(204).send("");
            }
        })
    }
});


//Search end point
app.get("/game/search/:title/:platform/:price", (req, res) => {
    var title = req.params.title;
    var platform = req.params.platform;
    var price = req.params.price;
    console.log(title, platform, price);
    game.search(title, platform, price, (error, results) => {
        if (error) {
            res.status(500).json({ Condition: "Unknown Error" });
            console.log(error)
        } else {
            res.status(200).send(results);

        }
    });
});

app.get("/games/title/:title", (req, res) => {
    var title = req.params.title;
    game.getGamesByTitle(title, (error, results) => {
        if (error) {
            res.status(500).json({ Condition: "Unknown Error" });
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/games/gameid/:gameid", (req, res) => {
    var gameid = req.params.gameid;
    game.getGamesById(gameid, (error, results) => {
        if (error) {
            res.status(500).json({ Condition: "Unknown Error" });
        } else {
            res.status(200).send(results);
        }
    });
});

app.get("/games", (req, res) => {
    game.getGames((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(results);
        }
    });
});


app.get('/user/:userid', function (req, res) {
    var id = req.params.userid;

    user.getUser(id, function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send("Some error");
        }
    });
});

app.post('/user/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    user.login(email, password, function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password']; //clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
            res.send();
        } else {
            res.status(500);
            res.send(err.statusCode);
        }
    });
});


app.post('/user/logout', function (req, res) {
    console.log("..logging out.");
    //res.clearCookie('session-id'); //clears the cookie in the response
    //res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, status: 'Log out successful!' });

});



app.put('/user/update', verifyToken, function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;


    user.updateUser(username, email, role, req.userid, function (err, result) {
        if (!err) {
            console.log("Update successful");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, result: result, status: 'Record updated successfully!' });
        } else {
            res.status(500);
            res.send(err.statuscode);
        }
    })
});


app.post('/user', function (req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;
    var password = req.body.password;
    var pic = req.body.pic;

    user.addUser(username, email, role, password, pic, function (err, result) {
        if (!err) {
            res.status(200);
            res.send(result);
        } else {
            res.status(500);
            res.send("{\"message\":\"Some error!\"}");
        }
    });
});

app.get('/user', function (req, res) {

    user.getUsers(function (err, result) {
        if (!err) {
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
});

app.post("/game", verifyToken, (req, res) => {
    var role = req.role;
    console.log(role);
    if (role.toUpperCase() == "ADMIN") {
        game.addGame(req.body, (error, result) => {
            if (error) {
                res.status(500).json({ Condition: "Unknown Error" });
            } else if (result == "taken") {
                res.status(422).json({ message: "The game is already exists" });
            } else if (result == "cat_exist") {
                res.status(422).json({ message: "The category name is already assign to the game." })
            } else {
                res.status(201).json({ gameid: result });
            }
        });
    } else {
        res.status(401).json({ message: "Not Authorized to Create!" })
    }

});

module.exports = app;