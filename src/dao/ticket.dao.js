const Ticket = require('../models/Ticket');

class TicketDAO {
  async findById(id) {
    return await Ticket.findById(id);
  }

  async findByCode(code) {
    return await Ticket.findOne({ code });
  }

  async findAll() {
    return await Ticket.find();
  }

  async create(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }
}

module.exports = new TicketDAO();
