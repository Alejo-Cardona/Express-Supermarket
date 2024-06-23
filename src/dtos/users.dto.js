class UsersDto {
    constructor(data) {
        this._id = data._id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.age = data.age
        this.password = data.password;
        this.cart = data.cart;
        this.role = data.role || 'user';
        this.documents = data.documents || [];
        this.last_connection = data.last_connection || Date.now();
    }

    // Método para obtener el DTO sin datos sensibles
    asDto() {
        return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            cart: this.cart,
            role: this.role
        };
    }
}

export default UsersDto