export default function calculateValorBilhete (ticket) {
  return ticket.valor_bilhete && ticket.porcentagem_taxa
    ? ticket.valor_bilhete * ticket.porcentagem_taxa * 0.01
    : 0
}
