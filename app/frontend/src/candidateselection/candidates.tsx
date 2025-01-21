import '../main.css';
import './select_candidates.css';
import {TopBar} from '../components/top_bar/top_bar';

function CandidatesSelection() {
    return (
        <>
            <div className="main-flex-container">
                <TopBar></TopBar>
    			<div className="central-container">
    				<div className="box-background">
    					<div className="inner-box-section top-inner-box-section">
    						<div id="name">Software Engineer</div>
    						<div id="type"> Internship #123456</div>
    						<div className="button-container">
    							<button type="button" className="std-button" id="cv">End Interview Phase</button>
    						</div>
					
    					</div>
    					<div className="inner-box-section" id="candidates">
    						<div className="box-composite-description">
    							<div className="box-description">
    								Candidates
    							</div>
    							<i className="material-icons">sync</i>
    						</div>
    						<div className="inner-container interviewed">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Mario Rossi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content ok" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container odd interviewed">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Mario Bianchi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content no" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Mario Verdi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content no" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container odd interviewed">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Giovanni Verdi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content ok" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Marco Rossi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content no" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container odd">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Marco Bianchi</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">John Doe</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container odd">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">John Smith</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>

    						<div className="inner-container">
    							<i className="material-icons small" id="interviewed-ico" title="interviewed">check_circle</i>
    							<div id="name">Juvraj</div>
    							<button type="button" className="std-button small" id="profile">View profile</button>
    							<button type="button" className="std-button small" id="form">Open interview form</button>
    							<div className="selector-button-container">
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">check</i></button>
    								<button type="button" className="std-button icon-content" id="profile"><i className="material-icons">close</i></button>
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>
            </div>
        </>
    )
}

export default CandidatesSelection;
