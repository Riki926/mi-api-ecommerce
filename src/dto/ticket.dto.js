class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.createdAt = ticket.createdAt;
  }
}

module.exports = { TicketDTO };
