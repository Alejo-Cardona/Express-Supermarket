import mongoose from "mongoose";
import supertest from "supertest";
import { MONGO_URI } from "../config/config.js";
import { expect } from 'chai'
import app from "../app.js";
import { productMockArray } from "./mock/products.mock.js"
import { userAdmin } from "./mock/users.mock.js"

mongoose.connect(MONGO_URI)
const requester = supertest('http://localhost:8080')


describe(' ---- Tensting para el router de Products ---- ', function() {
    let sessionCookie;
    let createdProductId; // Variable para almacenar el _id del producto creado

    before(function(done) {
        requester.post('/api/sessions/login')
            .send(userAdmin)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);
                sessionCookie = res.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
                done();
            });
    });

    it('POST: /api/products/create - UPLOAD NEW PRODUCT', async function(){
        let product = productMockArray[0]

        const response = await requester.post("/api/products/create")
            .set('Cookie', sessionCookie)
            .field("title", product.title)
			.field("description", product.description)
			.field("price", product.price)
			.field("stock", product.stock)
			.field("category", product.category)
            .attach("product-images", product.thumbnails[0])
            
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('_id');
            expect(mongoose.Types.ObjectId.isValid(response.body._id)).to.be.true;

            createdProductId = response.body._id
    }); 

    it('GET: /api/products/:pdi - GET PRODUCT', async function(){
        const response = await requester.get(`/api/products/${createdProductId}`)
            expect(response.status).to.equal(200)
    })

    it('DELETE: /api/products/remove/:pdi - DELETE PRODUCT', async function(){
        const response = await requester.delete(`/api/products/remove/${createdProductId}`)
            .set('Cookie', sessionCookie)

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', true);
    })
})