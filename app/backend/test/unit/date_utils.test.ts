import request from "supertest";
import { format_date_for_database, get_current_datetime } from "../../utils/date_utils";

let base_url = '/api/internship_management/'

describe('Date utils', () => {
    test('format_date_for_database correct formatting', () => {
        let test_date = new Date(2025,0,20)
        let received = format_date_for_database(test_date)
        expect(received).toBe("2025-1-20")
    })
    test('get_current_datetime correct formatting', () =>{
        jest.useFakeTimers()
            .setSystemTime(new Date('2025-01-20'));
        let received = get_current_datetime()
        expect(received).toBe('20/1/2025 @ 0:0:0')
    })
})

