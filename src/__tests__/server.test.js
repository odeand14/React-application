const express = require("express");
const request = require("supertest");
const app = express();

const api = require("../../server/server");
app.use(api);


describe('Creates a user, fails to create monkey, logs in then creates monkey. ' +
    'Does checks on monkey, alterations. Ten deletes monkey and user form DB', () => {
    const newUser = {name: "jonniboioioi", email: 'jboi@jboi.com', password: "jonnyerbest", repeatPassword: "jonnyerbest"};
    const newMonkey = {name: "Jonnybananas", race: "Mean bastard", user: "jboi@jboi.com"};
    let user, token, createdMonkey;

    it('should create user', () => {

        return request(app)
            .post("/users")
            .send(newUser)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body.email).toEqual(newUser.email);
                expect(res.body.name).toEqual(newUser.name);
            });

    });

    it('should fail to create a monkey', () => {

        return request(app)
            .post("/monkeys")
            .send(newMonkey)
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toEqual("You are not authorized for this action");
            });
    });


    it('should login user and return a JSON user and token', () => {
        return request(app)
            .post('/login')
            .send({email: newUser.email, password: newUser.password})
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body.token).toBeDefined();
                token = res.body.token;
                user = res.body.user;
                expect(user.email).toEqual('jboi@jboi.com');
                expect(user.name).toEqual('jonniboioioi');
            });
    });


    it('should return a JSON object with persons which contains user above', () => {
        return request(app)
            .get('/users')
            .set("Authorization", token)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body).toContainEqual(user);
            });
    });


    it('should create a monkey', () => {

        return request(app)
            .post("/monkeys")
            .set("Authorization", token)
            .send(newMonkey)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body.user).toEqual(user.email);
                expect(res.body.name).toEqual(newMonkey.name);
                expect(res.body.race).toEqual(newMonkey.race);
                expect(res.body.isPublic).toEqual(false);
                createdMonkey = res.body;
                console.log(createdMonkey.isPublic);
            });
    });

    it("should find new monkey in DB", () => {
        return request(app)
            .get(`/monkeys/${user.email}`)
            .set("Authorization", token)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body).toHaveLength(1);
                expect(res.body).toContainEqual(createdMonkey);
            });
    });

    it("should set monkey public", () => {
        return request(app)
            .put(`/monkeys/public/${createdMonkey._id}`)
            .send({isPublic: !createdMonkey.isPublic})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');
    });

    it("should find new monkey in DB with new true public state", () => {
        return request(app)
            .get(`/monkeys/${user.email}`)
            .set("Authorization", token)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body[0].isPublic).toBeTruthy();
                expect(res.body[0].name).toEqual(createdMonkey.name);
            });
    });

    it("should delete new monkey from DB", () => {
        return request(app)
            .delete(`/monkeys/${createdMonkey._id}`)
            .set("Authorization", token)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body._id).toEqual(createdMonkey._id);
            });

    });


    it("should delete new user from DB", () => {
        return request(app)
            .delete(`/users/${user._id}`)
            .set("Authorization", token)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(res => {
                expect(res.body._id).toEqual(user._id);
            });

    })

});
