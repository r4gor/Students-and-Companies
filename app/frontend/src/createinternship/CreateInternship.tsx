import { ChangeEvent, useState } from 'react'
import TopBarCentralText from '../components/top_bar/top_bar_central_text.tsx'
import '../main.css'
import './createInternship.css'
import { useAppState } from '../appstatecontext/AppStateContext';
import FormField from './components/FormField';
import ConfirmDialog from './components/ConfirmDialog';
import { format_search_parameters } from '../searchpage/handle_search.ts';

function CreateInternship ()  {
	const user_email = useAppState().userEmail;
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [application_end_date, setApplicationEndDate] = useState('')
	const [start_date, setStartDate] = useState('')
	const [end_date, setEndDate] = useState('')
	const [salary, setSalary] = useState(0)
	const [mode, setMode] = useState('presence')
	const [location, setLocation] = useState('')
	const [tags, setTags] = useState('')
	const [questions, setQuestions] = useState('')
	const [internship_created, setInternshipCreated] = useState(false)
	const [invalid_state_variables, setInvalidStateVariables] = useState({
		title:false,
		app_end_date:false,
		start_date:false,
		end_date:false,
		location:false,
		questions:false
	})

	function on_create_click() {
		if(validateInputs())
			return;
		post_internship({
			email: user_email,
			title: title,
			description: description,
			application_end_date: application_end_date,
			start_date: start_date,
			end_date: end_date,
			tags: tags,
			salary: salary,
			mode: mode,
			location:location,
			questions:questions
		}).then((result) => {
			if(result.ok)
				setInternshipCreated(true)
		})
	}

	function validateInputs():boolean {
		setInvalidStateVariables({
			title: title === '',
			app_end_date: application_end_date === '',
			start_date: start_date === '',
			end_date: end_date === '',
			location: location === '',
			questions: questions === ''
		})
		return (title === '' || 
				application_end_date === '' || 
				start_date === '' || 
				end_date === '' || 
				location === '' ||
				questions === ''
			)
	}

    return (
        <>
        <div className="create-internship">
			<div className="main-flex-container">
				<TopBarCentralText text='Create internship'></TopBarCentralText>
				<div className="central-container">
					<div className="box-background">
						<div className="inner-box-section">
							<FormField 	label='Insert a title for the new position:'
										type='text'
										name='title'
										value={title}
										is_invalid_state={invalid_state_variables.title}
										onChangeHook={setTitle}>
							</FormField>
							<div id="label">Insert a description:</div>
							<textarea 	name="description" 
										id="description"
										value={description} 
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
										rows={3}></textarea>
							<FormField 	label='Specify an application end date:'
										type='date'
										name='application_end_date'
										value={application_end_date}
										is_invalid_state={invalid_state_variables.app_end_date}
										onChangeHook={setApplicationEndDate}>
							</FormField>
							<FormField 	label='Specify a start date:'
										type='date'
										name='start_date'
										value={start_date}
										is_invalid_state={invalid_state_variables.start_date}
										onChangeHook={setStartDate}>
							</FormField>
							<FormField 	label='Specify an end date:'
										type='date'
										name='end_date'
										value={end_date}
										is_invalid_state={invalid_state_variables.end_date}
										onChangeHook={setEndDate}>
							</FormField>
							<div id="label">Specify the salary of the whole internship:</div>
							<input 	type='number'
									name='salary'
									id='salary'
									value={salary}
									step={100}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setSalary(Number(e.target.value))}
							/>
							<div id="label">Specify a mode:</div>
							<div className="select-wrapper">
								<select name="mode" id="mode" onChange={(e:ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)}>
									<option value="presence">In presence</option>
									<option value="remote">Fully remote</option>
									<option value="mixed">Mixed</option>
								</select>
							</div>
							
							<FormField 	label='Specify the internship location (insert company location if full remote):'
										type='text'
										name='location'
										value={location}
										is_invalid_state={invalid_state_variables.location}
										onChangeHook={setLocation}>
							</FormField>
							<div id="label">Tags:</div>
							<textarea 	name='tags-input'
										id='tags-input'
										value={tags}
										placeholder='Enter tags separated by spaces'
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTags(e.target.value)}
							/>
							<div id="label">Enter questions for the interview form:</div>
							<textarea 	name='questions-input'
										id='questions-input'
										value={questions}
										placeholder='Enter questions separated by new lines'
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuestions(e.target.value)}
							/>
							{invalid_state_variables.questions && (
								<div className="error-label">This field cannot be empty!</div>
							)}
							<div className="create-button-wrapper">
								<button type="button" className='std-button' onClick={on_create_click}>Create</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ConfirmDialog visible={internship_created} redirect='/internship_management'></ConfirmDialog>
        </div>
        </>
    )
}

async function post_internship(parameters: Object): Promise<Response> {
    let url = new URL('http://localhost:4000/api/internship_creation/create_internship')
    url.search = format_search_parameters(parameters)
    return fetch(url, {
        method: "POST"
    });
}

export default CreateInternship

