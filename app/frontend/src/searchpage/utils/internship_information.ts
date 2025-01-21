export class InternshipInformation {
    public id: number
    public company: string
    public title: string
    public description: string
    public post_date: Date
    public application_end_date: Date
    public start_date: Date
    public end_date: Date
    public salary: number
    public mode: string
    public location: string
    public tags: string[]
    public applied_students: number

    public constructor (
        raw_object: {
            id: string
            company: string
            title: string
            description: string
            start: string
            end: string
            published: string
            application_end: string
            salary: string
            mode: string
            location: string
            tags: string
            applied_students: string
        }
    ) {
        this.id = Number(raw_object.id)
        this.company = raw_object.company,
        this.title = raw_object.title,
        this.description = raw_object.description,
        this.post_date = new Date(raw_object.published),
        this.application_end_date = new Date(raw_object.application_end),
        this.start_date = new Date(raw_object.start),
        this.end_date = new Date(raw_object.end),
        this.salary = Number(raw_object.salary),
        this.mode = raw_object.mode,
        this.location = raw_object.location,
        this.tags = raw_object.tags === null ? [] : raw_object.tags.split(' ')
        this.applied_students = Number(raw_object.applied_students)
    }
}

