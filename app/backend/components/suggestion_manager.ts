import pool from "../utils/db_pool";
import {NotificationManager} from "./notification_manager";

export class SuggestionManager {
    public async suggest_student_to_companies(tags: string[], studentEmail: string): Promise<void> {
        if (tags.length === 0) return;

        // Query to fetch internships with at least one matching tag and in the application phase
        const query = `
            SELECT DISTINCT i.company_email, i.title
            FROM internship i
                     INNER JOIN tag_internship ti ON i.id = ti.internship_id
                     INNER JOIN tag t ON ti.tag_id = t.id
            WHERE i.application_end > NOW()
              AND t.description = ANY ($1::text[])
        `;

        try {
            const result = await pool.query(query, [tags]);
            const internships = result.rows;

            if (internships.length === 0) return;

            const receivers = internships.map(row => row.company_email);
            const titles = internships.map(row => `Potential Candidate for ${row.title}`);
            const content = `A student with matching interests has been suggested. Email: [${studentEmail}](/profile/${studentEmail})`;

            // Post notifications to companies
            for (let i = 0; i < receivers.length; i++) {
                await new NotificationManager().post_notifications([receivers[i]], titles[i], content, undefined);
            }
        } catch (err) {
            console.error("Error in suggest_student_to_companies:", err);
        }

    }

    public async suggest_internship_to_students(tags: string[], internshipId: string, internshipTitle: string): Promise<void> {
        if (!tags.length) return;

        // Query to fetch students who match at least one tag
        const query = `
            SELECT DISTINCT u.email
            FROM public."user" u
                     INNER JOIN public.tag_user tu ON u.email = tu.user_email
                     INNER JOIN public.tag t ON tu.tag_id = t.id
            WHERE u.user_type = 's'
              AND t.description = ANY ($1::text[])
        `;

        try {
            const result = await pool.query(query, [tags]);
            const students = result.rows;

            if (students.length === 0) return;

            const receivers = students.map((student) => student.email);
            const title = `New Internship Opportunity: ${internshipTitle}`;
            const content = `An internship matching your interests is available. [View details](/internship/${internshipId})`;

            // Post notifications to students
            await new NotificationManager().post_notifications(receivers, title, content, undefined);
        } catch (err) {
            console.error("Error in suggest_internship_to_students:", err);
        }
    }

}
