var knownStatuses = {

  'A': 'Active',
  'Active': 'Active',
  'ACTIVE': 'Active',
  'Back on Market': 'Active',
  'Extended': 'Active',
  'New': 'Active',
  'Price Change': 'Active',
  'Price Changed': 'Active',
  'Reactivated': 'Active',
  'Short Sale': 'Active',

  'Coming Soon': 'Active - Coming Soon',
  'Coming Soon-No Show': 'Active - Comm=ing Soon',
  'CS': 'Active - Coming Soon',

  'AC': 'Pending',
  'Active/Application Received': 'Pending',
  'Active Contingent': 'Pending',
  'Active Kick Out': 'Pending',
  'Active Option': 'Pending',
  'Active Option Contract': 'Pending',
  'Active RFR': 'Pending',
  'ActiveUnderContract': 'Pending',
  'Active Under Contract': 'Pending',
  'Active With Contingencies': 'Pending',
  'AO': 'Pending',
  'Application Submitted': 'Pending',
  'Backup': 'Pending',
  'Backup Contract-Call LA': 'Pending',
  'Contingency Contract': 'Pending',
  'Contingent': 'Pending',
  'CONTINGENT': 'Pending',
  'Contingent Take Backup': 'Pending',
  'CT': 'Pending',
  'First Right of Refusal': 'Pending',
  'NO SHOWINGS': 'Pending',
  'Option Pending': 'Pending',
  'P': 'Pending',
  'PB': 'Pending',
  'PD': 'Pending',
  'PF': 'Pending',
  'PI': 'Pending',
  'Pending': 'Pending',
  'PENDING': 'Pending',
  'Pending - Awaiting Signed Contracts': 'Pending',
  'Pending Continue to Show': 'Pending',
  'Pending - Over 4 Months': 'Pending',
  'Pending Sale': 'Pending',
  'Pending SB': 'Pending',
  'Pending/Show for Backup': 'Pending',
  'Pending - Take Backup': 'Pending',
  'Pending - Taking Backups': 'Pending',
  'PS': 'Pending',
  'Under Agreement': 'Pending',
  'Under Contract Cont. to Show': 'Pending',
  'Under Contract-No Show': 'Pending',
  'Under Contract-Show': 'Pending',
  'Show For Backups': 'Pending',
  'Short Sale Under Review': 'Pending',
  'Time Clause': 'Pending',
  'Active Reservation': 'Pending',

  'Closed': 'Closed',
  'CLOSED': 'Closed',
  'Closed Sale': 'Closed',
  'Leased': 'Closed',
  'Rental Leased': 'Closed',
  'Rented': 'Closed',
  'RENTED': 'Closed',
  'S': 'Closed',
  'C':'Closed',
  'SD': 'Closed',
  'Sold': 'Closed'

}
const statuses = (sts) => {
  if (knownStatuses[sts]) {
    return knownStatuses[sts];
  } else {
    return null;
  }
};

exports.statuses = statuses;
