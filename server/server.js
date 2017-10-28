const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/monkeys");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use("/", cors());

app.use((req, res, next) => {
    res.header("Access-Controll-Allow-Origin", "*");
    res.header("Access-Controll-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Controll-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const Monkey = mongoose.model("Monkey", {
    name: {type: String, required: true},
    race: {type: String, required: true},
    date: {type: Date, default: Date.now},

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

    const body = req.body;
    const monkey = new Monkey(body);

    monkey.save((err, savedMonkey) => {
        if (err) {
            res.status(500).send(err);
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


app.listen(1234, () => console.log("Listening on port 1234!"));