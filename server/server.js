const mongoose = require("mongoose");
const path = require('path');

const username = "jonnybananas";
const password = "Apeloff";
const dbUri = `mongodb://${username}:${password}@ds161455.mlab.com:61455/monkeydatabase`;

mongoose.connect(dbUri, {useMongoClient: true});

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

    User.findOne({email: body.email}, (err, result) => {
        if(err) {
            res.status(500).send(err);
        } else if(result) {
            res.status(409).send({message: 'Email taken!'});
        } else {

            if (!body.name) {
                res.status(400).send({message: 'Must contain username'});
                return;
            }

            if (!body.password) {
                res.status(400).send({message: 'Must contain password'});
                return;
            }

            if (body.password.length < 4) {
                res.status(400).send({message: 'Password must be at least 4 characters long!'});
                return;
            }

            if (body.password.localeCompare(body.repeatPassword) !== 0) {
                res.status(400).send({message: 'Passwords need to match!'});
                return;
            }
            const userWithHash = {
                name: body.name,
                email: body.email,
                password: bcrypt.hashSync(body.password, 10),
            };


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
    timestamp: {type: Date, default: Date.now},
    isPublic: {type: Boolean, default: false}
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

app.get("/monkeys/:email", (req, res) => {

    Monkey.find({user: req.params.email}, (err, monkeys) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(monkeys)
    })
});

app.get("/monkeys/public", (req, res) => {

    Monkey.find({isPublic: true}, (err, monkeys) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(monkeys)
    })

});

app.put("/monkeys/public/:id", (req, res) => {

    Monkey.findByIdAndUpdate(req.params.id, {isPublic: req.body.isPublic}, (err, updatedMonkey) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(updatedMonkey);
    })

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

    Monkey.findByIdAndUpdate(req.params.id, {name: req.body.name, race: req.body.race, timestamp: new Date()}, (err, updatedMonkey) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(updatedMonkey);
    })

});

app.use('/static', express.static(path.resolve(__dirname, '..', 'build', 'static')));

app.use('/favicon.ico', (req, res) => {
    console.log('hello fav');
    res.sendFile(path.resolve(__dirname, '..', 'build', 'favicon.ico'));
});

app.use('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
});

app.use('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


app.listen(PORT, () => console.log("Listening on port " + PORT + "!"));