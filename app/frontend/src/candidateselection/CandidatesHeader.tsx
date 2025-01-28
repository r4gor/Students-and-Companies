import '../main.css';
import './candidateSelection.css';
import {TopBar} from '../components/top_bar/top_bar';
import { Outlet } from 'react-router-dom';

function CandidatesHeader() {
    return (
        <>
            <div className="main-flex-container">
                <TopBar></TopBar>
    			<div className="central-container">
    				<div className="box-background">
    				    <Outlet />
    				</div>
    			</div>
            </div>
        </>
    )
}

export default CandidatesHeader;
