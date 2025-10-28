const ticketDAO = require('../dao/ticket.dao');

class TicketRepository {
  async findById(id) {
    return await ticketDAO.findById(id);
  }

  async findByCode(code) {
    return await ticketDAO.findByCode(code);
  }

  async findAll() {
    return await ticketDAO.findAll();
  }

  async create(ticketData) {
    return await ticketDAO.create(ticketData);
  }
}

module.exports = new TicketRepository();
