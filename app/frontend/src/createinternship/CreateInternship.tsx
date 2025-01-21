import { ChangeEvent, useState } from 'react'
import { TopBarCentralText } from '../components/top_bar/top_bar'
import '../main.css'
import './createInternship.css'
import { useAppState } from '../appstatecontext/AppStateContext';

function CreateInternship ()  {
	const user_email = useAppState().userEmail;
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [application_end_date, setApplicationEndDate] = useState('')
	const [start_date, setStartDate] = useState('')
	const [end_date, setEndDate] = useState('')
	const [tags, setTags] = useState('')
	const [invalid_state_variables, setInvalidStateVariables] = useState({
		title:false,
		app_end_date:false,
		start_date:false,
		end_date:false
	})

	function onCreateClick() {
		if(validateInputs())
			return;
		post_internship({
			email: user_email,
			title: title,
			description: description,
			application_end_date: application_end_date,
			start_date: start_date,
			end_date: end_date,
			tags: tags
		}).then((result) => {
			console.log(result)
		})
	}

	function validateInputs():boolean {
		setInvalidStateVariables({
			title: title === '',
			app_end_date: application_end_date === '',
			start_date: start_date === '',
			end_date: end_date === '',
		})
		return (title === '' || application_end_date === '' || start_date === '' || end_date === '')
	}

    return (
        <>
        <div className="create-internship">
					<div className="main-flex-container">
						<TopBarCentralText text='Create internship'></TopBarCentralText>
						<div className="central-container">
							<div className="box-background">
								<div className="inner-box-section">
									<FormField 	label='Title'
												type='text'
												name='title'
												value={title}
												is_invalid_state={invalid_state_variables.title}
												onChangeHook={setTitle}>
									</FormField>
									<div id="label">Description</div>
									<textarea 
												name="description" 
												id="description"
												value={description} 
												onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
												rows={3}></textarea>
									<FormField 	label='Application end date'
												type='date'
												name='application_end_date'
												value={application_end_date}
												is_invalid_state={invalid_state_variables.app_end_date}
												onChangeHook={setApplicationEndDate}>
									</FormField>
									<FormField 	label='Start date'
												type='date'
												name='start_date'
												value={start_date}
												is_invalid_state={invalid_state_variables.start_date}
												onChangeHook={setStartDate}>
									</FormField>
									<FormField 	label='End date'
												type='date'
												name='end_date'
												value={end_date}
												is_invalid_state={invalid_state_variables.end_date}
												onChangeHook={setEndDate}>
									</FormField>
									<div id="label">Tags</div>
									<textarea
										name='tags-input'
										id='tags-input'
										value={tags}
										placeholder='Enter tags separated by spaces'
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTags(e.target.value)}
									/>
									<button type="button" className='std-button' onClick={onCreateClick}>Create</button>
								</div>
							</div>
						</div>
					</div>
        </div>
        </>
    )
}

function FormField ({label, type, name, value, is_invalid_state=false, onChangeHook} : {label:string, type:string, name:string, value:string, is_invalid_state:boolean, onChangeHook:React.Dispatch<React.SetStateAction<string>>}) {
	return (
		<>
		<div id="label">
			{label}
		</div>
		<input
			type={type}
			name={name}
			id={name}
			value={value}
			onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHook(e.target.value)}
		/>
		{is_invalid_state && (
			<div className="error-label">This field cannot be empty!</div>
		)}
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
//TODO: merge with the one in branch dev_internship_browsing
/**
 * Converts a set of parameters into a URL query
 * @param parameters parameters Object to be converted
 * @param allow_empty default to true, allows to pass empty parameters (such as empty strings)
 * @returns string that contains all parameters formatted as a URL query
 */
function format_search_parameters(parameters: Object, allow_empty:boolean=true) : string {
    let search_params: URLSearchParams = new URLSearchParams();
    Object.entries(parameters).forEach(([key, value]: [any,any]) => {
        if (!!value || allow_empty) {
            search_params.append(key, value);
        }
    });
    return search_params.toString();
} 

export default CreateInternship

