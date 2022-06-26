export function getAfterLastCharacter({string, character} : {string: string, character: string}) {
    const lastIndex = string.lastIndexOf(character)
    const lastEndpoint = string.substring(lastIndex)
    const lastEndpointFormat = lastEndpoint.split(character).join('')
    return lastEndpointFormat
}
//From stack overflow, not my code but is very handy!
export const getFromBetween = {
  results: [] as string[],
  string: "",
  getFromBetween: function (sub1 : string, sub2: string) {
      try {
          if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
          let SP = this.string.indexOf(sub1) + sub1.length;
          let string1 = this.string.substr(0, SP);
          let string2 = this.string.substr(SP);
          let TP = string1.length + string2.indexOf(sub2);
          return this.string.substring(SP, TP) as string;
      } catch (e) {
          console.error('GET FROM BETWEEN ERROR: ' + e)
          console.trace();
          return 
      }
  },
  removeFromBetween: function (sub1 : string, sub2: string) {
      try {
          if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
          let removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
          this.string = this.string.replace(removal, "");
      } catch (e) {
          console.error('REMOVE FROM BETWEEN ERROR: ' + e)
          console.trace();
          return
      }
  },
  getAllResults: function (sub1 : string, sub2: string) {
      try {
          // first check to see if we do have both substrings
          if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

          // find one result
          let result = this.getFromBetween(sub1, sub2) as string;
          // push it to the results array
          this.results.push(result);
          // remove the most recently found one from the string
          this.removeFromBetween(sub1, sub2);

          // if there's more substrings
          if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
              this.getAllResults(sub1, sub2);
          }
          else return;
      } catch (e) {
          console.error('GET ALL RESULTS ERROR: ' + e)
          console.trace();
          return
      }
  },
  get: function (string : string, sub1 : string, sub2 : string) {
      this.results = [];
      this.string = string;
      this.getAllResults(sub1, sub2);
      return this.results;
  }
};

