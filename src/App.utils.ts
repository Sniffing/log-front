export class Utils {
  public static unixTimeToDate(time: number) {
    const date = new Date(time);        
    return `${('0' + date.getDate()).slice(-2)}-${('0' + date.getMonth()+1).slice(-2)}-${date.getFullYear()}`;
  }

  public static fromReversedDate(date: string) {
    const dateParts = date.split('-');

    if (dateParts.length !== 3) return date;
    
    const parsedDate = new Date(`${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`);
    return `${parsedDate.getDate()} ${parsedDate.toLocaleDateString('default', { month: 'long' })} ${parsedDate.getFullYear()}`;
  }
}