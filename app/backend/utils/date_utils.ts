/**
 * Returns the current date and time formatted as dd/MM/yyyy hh:mm:ss
 * @returns string representing current date and time
 */
export function get_current_datetime() : string {
    var currentdate = new Date();
    return currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
}