import { ChangeEvent, useState } from 'react'
import { TopBarCentralText } from '../components/top_bar/top_bar'
import '../main.css'
import './createInternship.css'

function CreateInternship ()  {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [application_end_date, setApplicationEndDate] = useState('')
	const [start_date, setStartDate] = useState('')
	const [end_date, setEndDate] = useState('')
	const [tags, setTags] = useState([] as string[])
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
												onChangeHook={setApplicationEndDate}>
									</FormField>
									<FormField 	label='Start date'
												type='date'
												name='start_date'
												value={start_date}
												onChangeHook={setStartDate}>
									</FormField>
									<FormField 	label='End date'
												type='date'
												name='end_date'
												value={end_date}
												onChangeHook={setEndDate}>
									</FormField>
									<div id="label">Tags</div>
									<textarea
										name='tags-input'
										id='tags-input'
										value={tags}
										placeholder='Enter tags separated by commas'
										onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTags(e.target.value.split(','))}
									/>
									<button type="button" className='std-button'>Create</button>
								</div>
							</div>
						</div>
					</div>
        </div>
        </>
    )
}

function FormField ({label, type, name, value, onChangeHook} : {label:string, type:string, name:string, value:string, onChangeHook:React.Dispatch<React.SetStateAction<string>>}) {
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
		</>
	)
}

export default CreateInternship