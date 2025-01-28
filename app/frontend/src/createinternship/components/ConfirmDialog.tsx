import { MutableRefObject, useEffect, useRef } from "react";

function ConfirmDialog({visible, redirect}:{visible:boolean, redirect:string}) {
    const ref:MutableRefObject<HTMLDialogElement> = useRef() as MutableRefObject<HTMLDialogElement>;

    useEffect(() => {
        if (visible) {
        ref.current?.showModal();
        } else {
        ref.current?.close();
        }
    }, [visible]);

    function onCloseClick() {
        window.location.href = redirect;
    }

	return (
		<>
        <dialog ref={ref}>
            <div className="dialog-container">
                <div className="title">Internship created successfully!</div>  
                <div className="content">
                    <div className="description">Students will now be able to apply to your new internship</div>
                    <button type="button" className="std-button" onClick={onCloseClick}>Close</button>
                </div>
            </div>
        </dialog> 
		</>
	)
}

export default ConfirmDialog