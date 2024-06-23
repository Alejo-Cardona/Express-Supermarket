import TicketDao from "../daos/tickets.dao.js"
import generateCustomCode from "../utils/customid.js"

class TicketsService {
    static #instance;

    constructor() {
        this.dao = new TicketDao()
    }

    static getInstance() {
        if(!this.#instance) {
            this.#instance = new TicketsService()
        }
        return this.#instance;
    }

    // Método para crear un ticket
    createTicket = async(purchaser, amount) => {
        const code = await generateCustomCode()
        const date = Date.now()

        const result = await this.dao.create(purchaser, amount, code, date)
        return result
    }
}

// Exportar la instancia única del servicio
export const ticketsService = TicketsService.getInstance();