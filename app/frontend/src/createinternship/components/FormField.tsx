import { ChangeEvent } from "react"

function FormField ({label, type, name, value, is_invalid_state=false, onChangeHook} : {label:string, type:string, name:string, value:string, is_invalid_state:boolean, onChangeHook:React.Dispatch<React.SetStateAction<string>>}) {
	return (
		<>
		<div id="label">{label}</div>
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

export default FormField