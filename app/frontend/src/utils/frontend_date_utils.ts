export function date_to_ddMMyyyy_string(date:Date) {
    return date.getDate() + "/"
                        + (date.getMonth()+1)  + "/" 
                        + date.getFullYear()
}

export function date_diff_to_sentence(first_date:Date): string {
    let current_date = new Date()
    let yr_diff = first_date.getFullYear() - current_date.getFullYear()
    let mm_diff = first_date.getMonth() - current_date.getMonth()
    let dd_diff = first_date.getDay() - current_date.getDay()
    
    if(yr_diff > 0)
        return yr_diff + (yr_diff === 1 ? ' year' : ' years') + ' ago'
    if(mm_diff > 0)
        return mm_diff + (mm_diff === 1 ? ' month' : ' months') + ' ago'
    if(dd_diff > 0)
        return dd_diff + (dd_diff === 1 ? ' day' : ' days') + ' ago'
    return 'today'
}