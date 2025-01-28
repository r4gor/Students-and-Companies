import { useEffect, useState } from 'react'
import '../internshipMgmt.css'
import { useAppState } from '../../appstatecontext/AppStateContext'

type QuestionType = {
    id: number,
    text: string,
}

// type FeedbackType = {
//     question_id: number,
//     internship_id: number,
//     user_email: string,
//     rating: number
// }

type RatingType = {
    id: number,
    value: null | number,
}

function FeedbackPopup(_params: {internship_id: number}) {
    const [questions, setQuestions] = useState([] as Array<QuestionType>);
    const [ratings, setRatings] = useState([] as Array<RatingType>);
    const [index, setIndex] = useState(0);

    // const IS_ID = 1;
    const appState = useAppState();

    async function fetch_questions() {
		const options = {
			method: 'GET',
			headers: {
    			'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			    user_type: appState.userType,
			})
		};
        await fetch('http://localhost:4000/api/feedbacks/fetch/questions', options)
        .then(res => {
            if(!res.ok) {
                console.dir(res);
                return;
            }
            res.json().then(data => {
                let array: Array<QuestionType> = JSON.parse(data);
                setQuestions(array);
                setRatings(array.map((q) => ({id: q.id, value: null})))
            });
        }).catch(console.error);
    }

    function handle_button_right() {
        setIndex(index + 1);
    }

    function handle_button_left() {
        setIndex(index > 0 ? index - 1 : index);
    }

    useEffect(() => {
        fetch_questions();
    }, []);

    return (<>
        <div className='popup-wrapper'>
            <div className='popup-container'>
                <div className='popup-question'>
                    {`${index}. ${questions[index].text}`}
                </div>
                <div className='popup-rating'>
                    {`/*RATING ${index}: ${ratings[index]}*/`}`
                </div>
            </div>
            <div className='button-group'>
                <button type='button' className='std-button' onClick={handle_button_left}>
                    back
                </button>
                <button type='button' className='std-button' onClick={handle_button_right}>
                    next
                </button>
            </div>
        </div>
    </>)
}

export default FeedbackPopup;
