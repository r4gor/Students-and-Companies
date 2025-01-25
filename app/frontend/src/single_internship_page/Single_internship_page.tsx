import '../main.css'
import './Single_internship_page.css'
import {TopBarCentralText} from "../components/top_bar/top_bar.tsx";
import InternshipPreview from "../searchpage/components/InternshipPreview.tsx";
import {InternshipInformation} from "../searchpage/utils/internship_information.ts";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";


function Single_internship_page() {
    const { internshipId } = useParams<{ internshipId?: string }>();

    const [internship_list, setInternshipList] = useState<[{}]>();

    const fetchInternship = async () => {
        const response = await fetch(
            'http://localhost:4000/api/single_internship/get_internship',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({internshipId: internshipId}),
            }
        );

        if (!response.ok) {
            alert('Failed to fetch internships for this company');
            return;
        }

        let data = await response.json();
        if (!data || Object.keys(data).length === 0){
            alert('Failed to fetch internship');
            return;
        }
        console.log(data);
        setInternshipList([data]);
    }

    useEffect(() => {
        fetchInternship()
    }, []);

    return (
        <div className="single-internship-page">
            <div className="main-flex-container">
                <TopBarCentralText text={'Internship'}></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        {Array.isArray(internship_list) &&
                            internship_list.map((content: any) =>
                                <InternshipPreview key={content.id}
                                                   info={new InternshipInformation(content)}></InternshipPreview>
                            )
                        }
                    </div>
                    <div className="side-column" id="right"></div>
                </div>
            </div>
        </div>
    )
}

export default Single_internship_page