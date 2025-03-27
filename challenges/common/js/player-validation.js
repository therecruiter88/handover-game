export const validPlayers = [
    "001", "002", "016", "018", "019", "023", "026", "051", "054", "057", "065",
    "068", "077", "107", "120", "130", "135", "136", "141", "182", "183", "186",
    "187", "188", "194", "221", "222", "226", "229", "232", "243", "273", "278",
    "286", "287", "297", "301", "339", "343"
  ];
  
  export function isPlayerNumberValid(playerNumber) {
    return validPlayers.includes(playerNumber);
  }