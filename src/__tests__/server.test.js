const express = require("express");
const request = require("supertest");
const app = express();

const api = require("../../server/server");
app.use(api);

describe('create, login and check of user and delete', () => {
    const newUser = {name: "jonniboioioi", email: 'jboi@jboi.com', password: "jonnyerbest", repeatPassword: "jonnyerbest"};
    let user, token;

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


    it('should return a JSON person and token', () => {
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

describe('create, edit and delete monkey', () => {
    // it('should return a JSON reply with persons', () => {
    //     // send a request
    //     return request(app)
    //         .get('/users')
    //         // verify response
    //         .expect(200)
    //         .expect('Content-Type', 'application/json; charset=utf-8')
    //         .expect(res => {
    //             expect(res.body).toHaveLength(7);
    //             // expect(res.body).toContain({email: 'a@a.no', password: 'aaa'});
    //         });
    // });
});