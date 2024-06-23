import mongoose from "mongoose";
import supertest from "supertest";
import { MONGO_URI } from "../config/config.js";
import { expect } from 'chai'
import app from "../app.js";
import { productMockArray } from "./mock/products.mock.js"
import { userAdmin } from "./mock/users.mock.js"

mongoose.connect(MONGO_URI)
const requester = supertest('http://localhost:8080')


describe(' ---- Tensting para el router de Carts ---- ', function() {
    let sessionCookie;
    let createdProductId; // Variable para almacenar el _id del producto creado
    let itemId; // _id del producto dentro del cart
    let quantity = 2 // Cantidad del producto a agregar al carrito

    // Inicia sessión
    before(function(done) {
        requester.post('/api/sessions/login')
            .send(userAdmin)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);
                sessionCookie = res.headers['set-cookie'].find(cookie => cookie.startsWith('connect.sid')).split(';')[0];
                done();  // Indicar que el before ha terminado
            });
    });

    // Crea un producto para probar el cart
    before(function(done){
        // Creo un producto
        let product = productMockArray[1]
        requester.post("/api/products/create")
            .set('Cookie', sessionCookie)
            .field("title", product.title)
            .field("description", product.description)
            .field("price", product.price)
            .field("stock", product.stock)
            .field("category", product.category)
            .attach("product-images", product.thumbnails[0])
            .end((err, res) => {
                if (err) return done(err);
                createdProductId = res.body._id; // Guardar el ID del producto creado
                done()
            });
    })

    it('POST: /api/carts/add/:pdi - ADD PRODUCT TO CART', async function(){
        const response = await requester.post(`/api/carts/add/${createdProductId}`)
            .set('Cookie', sessionCookie)
            .send({quantity})

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('items');
            expect(response.body.items).to.be.an('array');
            
            const item = response.body.items[0]
            itemId = item._id
    }); 

    it('DELETE: /api/carts/remove/:iid - DELETE PRODUCT TO THE CART', async function(){
        const response = await requester.delete(`/api/carts/remove/${itemId}`)
            .set('Cookie', sessionCookie)

            expect(response.status).to.equal(200)
    })

    after(function(done) {
        if (!createdProductId) return done();

        requester.delete(`/api/products/remove/${createdProductId}`)
            .set('Cookie', sessionCookie)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.have.property('status', true);
                done();
            });
    });
})