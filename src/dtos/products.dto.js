class ProductsDto {
    constructor(data) {
        this._id = data._id
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
        this.code = data.code || 'Falta el CODE'
        this.stock = data.stock;
        this.status = data.status || true;
        this.category = data.category;
        this.owner = data.owner || 'admin';
        this.thumbnails = data.thumbnails || [];
    }
}

export default ProductsDto