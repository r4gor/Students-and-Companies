import { ChangeEvent, useEffect, useState } from 'react'
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

function FeedbackPopup(params: {id: number, title: string, setVisible: Function}) {
    const [ratings, setRatings] = useState([] as Array<RatingType>);
    const [questions, setQuestions] = useState([] as Array<QuestionType>);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [index, setIndex] = useState(0);

    const appState = useAppState();

    async function fetch_questions() {
		const options = {
			method: 'POST',
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
                console.dir(array)
                setCurrentQuestion(array[0].text);
                setQuestions(array);
                setRatings(array.map((q) => ({id: q.id, value: null})));
            });
        }).catch(console.error);
    }

    async function post_feedback() {
		const options = {
			method: 'POST',
			headers: {
    			'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			    feedbacks: questions.map((q,i) => ({
			        question_id: q.id,
			        internship_id: params.id,
			        user_email: appState.userEmail,
			        rating: ratings[i].value
			    }))
			})
		};
        await fetch('http://localhost:4000/api/feedbacks/post', options)
    }

    function atFinalRating(): boolean {
        return index == ratings.length - 1;
    }

    function canSubmit(): boolean {
        return ratings.every(r => r.value != null);
    }

    function handle_button_right() {
        if (atFinalRating()) {
            if (canSubmit()) {
                post_feedback();
                params.setVisible(false);
            }
        } else {
            setCurrentQuestion(questions[index+1].text);
            setIndex(index + 1);
        }
    }

    function handle_button_left() {
        if (index > 0) {
            setCurrentQuestion(questions[index-1].text);
            setIndex(index - 1);
        }
    }

    function handle_button_close() {
        params.setVisible(false);
    }

    function right_button_class(): string {
        return "std-button" + (atFinalRating() && !canSubmit() ? " deactivated" : "");
    }

    function onRatingChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const tmp = ratings.slice();
        tmp[index].value = new Number(event.target.value).valueOf();
        setRatings(tmp);
    }

    useEffect(() => {
        fetch_questions();
        console.log('id: ' + params.id);
    }, []);

    return (<>
        <div className='popup-wrapper'>
            <div id='name'>{params.title}</div>
            <hr/>
            <div className='popup-container'>
                <div className='popup-question' id='description'>
                    {`${currentQuestion} (from 1: very little, to 5: very much)`}
                </div>
                <div className='rating-wrapper'>
                    <RadioButtonGroup 
                        index={index} 
                        value={ratings.length > 0 ? ratings[index].value : null} 
                        setValue={onRatingChange} 
                    />
                </div>
                <div className='counter' id='description'>{`${index+1}/${questions.length}`}</div>
            </div>
            <div className='button-group'>
                <button type='button' className='std-button' onClick={handle_button_close}>
                    close
                </button>
                <div className='right-group'>
                    <button type='button' className='std-button' onClick={handle_button_left}>
                        back
                    </button>
                    <button type='button' className={right_button_class()} onClick={handle_button_right}>
                        {atFinalRating() ? "submit" : "next"}
                    </button>
                </div>
            </div>
        </div>
    </>)
}

function RadioButtonGroup(params: {
    index: number, 
    value: null | number, 
    setValue: (i: number, e: ChangeEvent<HTMLInputElement>) => void}
) {
    return (
        [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='radio-element'>
                <input
                    type='radio'
                    name='rating'
                    value={i}
                    checked={params.value === i}
                    onChange={e => params.setValue(params.index, e)}
                />
                <label id='description'>{i}</label>
            </div>
        ))
    )
}

export default FeedbackPopup;


// TODO: change color 'leave feedback'
// TODO: check same behaviour about feedbacks for both students and companies
