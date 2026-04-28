export function Truncate({ str, num }) {
  if (str === undefined) {
    return str;
  }
  
  if (str.length <= num) {
    return str;
  }
  
  return <>{str.slice(0, num)}...</>;
}
  