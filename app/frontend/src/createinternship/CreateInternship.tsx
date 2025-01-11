import { TopBarCentralText } from '../components/top_bar/top_bar'
import '../main.css'
import './createInternship.css'

function CreateInternship ()  {
    return (
        <>
        <div className="create-internship">
					<div className="main-flex-container">
						<TopBarCentralText text='Create internship'></TopBarCentralText>
						<div className="central-container">
							<div className="box-background">
								<div className="inner-box-section top-inner-box-section">
									<div id="name">Software Engineer</div>
									<div id="type"> Internship #123456</div>
									<div className="button-container">
										<button type="button" className="std-button" id="cv">End Interview Phase</button>
									</div>
									
								</div>
							</div>
						</div>
					</div>
        </div>
        </>
    )
}

export default CreateInternship