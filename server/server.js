const mongoose = require("mongoose");

const url = process.env.MONGOLAB_URI;

mongoose.connect(url, {useMongoClient: true});

const jwtSimple = require('jwt-simple');
const bcrypt = require('bcryptjs');

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use("/", cors());

const jwtSecret = 'top super secret password do not share';

const PORT = process.env.PORT || 1234;


app.use((req, res, next) => {
    res.header("Access-Controll-Allow-Origin", "*");
    res.header("Access-Controll-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Controll-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const User = mongoose.model("User", {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

const tokenExists = (req, res) => {
    const token = req.headers.authorization;
    if (token && (token.split(".").length === 3)) {
        const decodedToken = jwtSimple.decode(token, jwtSecret);
        const userName = req.body.user;

        if (decodedToken.email === userName) {
            console.log(decodedToken);
            return jwtSimple.decode(token, jwtSecret);
        } else {
            res.status(401).send({message: 'Username does not match!'});
            return false;
        }
    }
    res.status(401).send({message: 'No token'});
    return false;
};


app.post('/users', (req, res) => {
    const body = req.body;

    //TODO must send user or i neeed to fix the json somewhere
    User.findOne({email: body.email}, (err, result) => {
        if(err) {
            res.status(500).send(err);
        } else if(result) {
            res.status(409).send("Email taken!");
        } else {

            const userWithHash = {
                name: body.name,
                email: body.email,
                password: bcrypt.hashSync(body.password, 10),
            };

            if (!body.name) {
                res.status(400).send('Must contain username');
                return;
            }

            if (!body.password) {
                res.status(400).send('Must contain password');
                return;
            }

            const user = new User(userWithHash);

            user.save((err, savedUser) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(201).send(savedUser);
            })

        }
    });

});

app.get("/users", (req, res) => {

    User.find((err, users) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(users);
    });
});

app.post('/login', (req, res) => {
    const user = req.body;

    if (!user.email) {
        res.status(400).send({message: 'Must contain username'});
        return;
    }

    if (!user.password) {
        res.status(400).send({message: 'Must contain password'});
        return;
    }

    User.findOne({email: user.email}, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (!result) {
            res.status(401).send({message: 'User does not exist!'});
        } else {
            const passwordMatches = bcrypt.compareSync(
                user.password,
                result.password
            );

            if (!passwordMatches) {
                res.status(401).send({message: 'Wrong password'});
                return;
            }

            const payload = {
                email: user.email,
            };

            const token = jwtSimple.encode(payload, jwtSecret);
            res.status(201).send({token: token, user: result});
        }
    })
});


const Monkey = mongoose.model("Monkey", {
    name: {type: String, required: true},
    race: {type: String, required: true},
    user: {type: String, required: true},

});

app.get("/monkeys", (req, res) => {

    Monkey.find((err, monkeys) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(monkeys);
    });
});

app.post("/monkeys", (req, res) => {

    const email = tokenExists(req, res);
    if (!email) {
        res.status(401).send({message: 'Need to log in to create a little monkey!'});
        return;
    }

    const body = req.body;
    const monkey = new Monkey(body);

    monkey.save((err, savedMonkey) => {
        if (err) {
            res.status(401).send(err);
            return;
        }
        res.status(201).send(savedMonkey);
    });

});

app.delete("/monkeys/:id", (req, res) => {

    Monkey.findByIdAndRemove(req.params.id, (err, deletedMonkey) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(deletedMonkey);
    });

});

app.put("/monkeys/:id", (req, res) => {

    Monkey.findByIdAndUpdate(req.params.id, {name: req.body.name, race: req.body.race}, (err, updatedMonkey) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(updatedMonkey);
    })

});


app.listen(PORT, () => console.log("Listening on port " + PORT + "!"));