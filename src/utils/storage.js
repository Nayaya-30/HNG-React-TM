// Utility Functions for Storage
const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const getTickets = () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allTickets = localStorage.getItem('tickets');
  const tickets = allTickets ? JSON.parse(allTickets) : [];
  
  // Filter tickets by user
  return tickets.filter(ticket => ticket.userId === user.id);
};

const saveTickets = (tickets) => {
  const user = getCurrentUser();
  if (!user) return;
  
  // Get all tickets
  const allTickets = localStorage.getItem('tickets');
  let allTicketsArray = allTickets ? JSON.parse(allTickets) : [];
  
  // Remove current user's tickets
  allTicketsArray = allTicketsArray.filter(ticket => ticket.userId !== user.id);
  
  // Add current user's tickets with userId
  const userTickets = tickets.map(ticket => ({
    ...ticket,
    userId: user.id
  }));
  
  // Combine and save
  const newTicketsArray = [...allTicketsArray, ...userTickets];
  localStorage.setItem('tickets', JSON.stringify(newTicketsArray));
};

export { getTickets, saveTickets, getCurrentUser };