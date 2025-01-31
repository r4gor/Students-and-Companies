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

/**
 * Formats a date object according to yyyy-MM-dd format 
 * @param date date object to format
 * @returns a string in the format yyyy-MM-dd
 */
export function format_date_for_database(date: Date): string {
    return date.getFullYear() + '-' 
        + (date.getMonth()+1) + '-'
        + date.getDate();
}