export function date_to_ddMMyyyy_string(date:Date):string {
    return date.getDate() + "/"
                        + (date.getMonth()+1)  + "/" 
                        + date.getFullYear()
}

export function date_diff_to_sentence(first_date:Date): string {
    let current_date = new Date()
    let yr_diff = current_date.getFullYear() - first_date.getFullYear()
    let mm_diff = current_date.getMonth() - first_date.getMonth()
    let dd_diff = current_date.getDate() - first_date.getDate()

    if(yr_diff > 0)
        return yr_diff + (yr_diff === 1 ? ' year' : ' years') + ' ago'
    if(mm_diff > 0)
        return mm_diff + (mm_diff === 1 ? ' month' : ' months') + ' ago'
    if(dd_diff > 0)
        return dd_diff + (dd_diff === 1 ? ' day' : ' days') + ' ago'
    return 'today'
}

export function month_diff(date_from:Date, date_to:Date): number {
    return  date_to.getMonth() - date_from.getMonth() + 
            (12 * (date_to.getFullYear() - date_from.getFullYear()))
}