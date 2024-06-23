// Insertar los carts vacios

db.carts.insertMany([
    {
        items: []
    },
    {
        items: []
    },
    {
        items: []
    }
])


// Si se insertan los usuarios de esta manera, se tendra que asignar los Object _id de los carts de manera manual
// Si registra los usuarios en POST /api/sessions/register ---> se les creará y asignará un cart directamente
// Aquí hay un usuario Admin, premium y un user normal
// Estos usuarios tienen un last_connection de hace mas de 2 dias
db.users.insertMany([
    {
        first_name: "Coder",
        last_name: "House",
        email: "coder.user@gmail.com",
        age: 20,
        password: "123",
        cart: "SE DEBE ASIGNAR EL CART",
        role: "admin",
        documents: [],
        last_connection: new Date("2024-06-18T21:16:54.783Z")
    },
    {
        first_name: "Lionel",
        last_name: "Messi",
        email: "Lionel.Messi@gmail.com",
        age: 36,
        password: "123",
        cart: "SE DEBE ASIGNAR EL CART",
        role: "premium",
        documents: [],
        last_connection: new Date("2024-06-18T21:16:54.783Z")
    },
    {
        first_name: "Juan",
        last_name: "Gonzales",
        email: "juan.gonzales@gmail.com",
        age: 43,
        password: "123",
        cart: "SE DEBE ASIGNAR EL CART",
        role: "user",
        documents: [],
        last_connection: new Date("2024-06-18T21:16:54.783Z")
    }
])