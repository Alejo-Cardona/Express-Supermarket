import ticketModel from "../models/ticket.model.js";
import logger from "../utils/winston.js";

class TicketsDao {
    constructor() {
        this.model = ticketModel
    }

    // Método para crear un ticket
    create = async(purchaser, amount, code, date) => {
        try {
            const newCart = await this.model.create({code: code, purchase_datetime: date, amount: amount, purchaser: purchaser})
            return newCart
        } catch(error) {
            return logger.error({message: "Error al crear un ticket", error: error})
        }
    }

}

export default TicketsDao