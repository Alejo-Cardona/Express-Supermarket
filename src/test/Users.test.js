import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { MONGO_URI } from "../config/config.js";
import { expect } from 'chai'
import { user } from "./mock/users.mock.js"

mongoose.connect(MONGO_URI)
const requester = supertest('http://localhost:8080')


describe(' ---- Tensting para el router de Users ---- ', function() {
    let sessionCookie;
    let userId;

    before(function(done) {
        requester.post('/api/sessions/login')
            .send(user)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);
                sessionCookie = res.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
                done();
            });
    });

    before(function(done) {
        requester.get('/api/sessions/current')
            .set('Cookie', sessionCookie)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                userId = res.body._id
                done();
            });
    });

    it('POST: /api/users/documents - UPLOAD DOCUMENTS', async function(){

        const response = await requester.post("/api/users/documents")
            .set('Cookie', sessionCookie)
            .attach("profile", "./src/test/documentsTest/profile-image-TEST.jpg")
            .attach("homeVoucher", "./src/test/documentsTest/AccountVoucher-TEST.xlsx")
            .attach("accountVoucher", "./src/test/documentsTest/HomeVoucher-TEST.xlsx")
            
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message', 'Los archivos se subieron correctamente');
    }); 

    it('PUT: /api/users/premium/:uid - CHANGE TO PREMIUM', async function(){
        const response = await requester.put(`/api/users/premium/${userId}`)
            .set('Cookie', sessionCookie)
            
            expect(response.status).to.equal(200)
    }); 

})