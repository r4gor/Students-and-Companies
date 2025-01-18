export class InternshipInformation {
    public company: string
    public title: string
    public description: string
    public post_date: Date
    public application_end_date: Date
    public start_date: Date
    public end_date: Date
    public salary: number
    public mode: string
    public tags: string[]

    public constructor (
        raw_object: {
            company: string
            title: string
            description: string
            post_date: string
            application_end_date: string
            start_date: string
            end_date: string
            salary: string
            mode: string
            tags: string[]
        }
    ) {
        this.company = raw_object.company,
        this.title = raw_object.title,
        this.description = raw_object.description,
        this.post_date = new Date(raw_object.post_date),
        this.application_end_date = new Date(raw_object.application_end_date),
        this.start_date = new Date(raw_object.start_date),
        this.end_date = new Date(raw_object.end_date),
        this.salary = Number(raw_object.salary),
        this.mode = raw_object.mode,
        this.tags = raw_object.tags
    }
}

