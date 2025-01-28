import '../main.css'
import './about.css'
import TopBarCentralText from "../components/top_bar/top_bar_central_text.tsx";

function About() {
    return (
        <>
            <div className="about">
                <TopBarCentralText text={'Profile'}></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <p>
                            We’re just a group of university friends who came together with a shared passion for solving
                            real-world problems through creativity and technology.
                        </p>
                        <p>
                            This web app is more than just a project for us—it’s a reflection of late-night
                            brainstorming sessions, countless cups of coffee, and the excitement of turning ideas into
                            reality.
                        </p>
                        <p>
                            Built with dedication and a little bit of chaos, we hope this app not only meets its purpose
                            but also inspires others to chase their curiosity and create something awesome.
                        </p>
                        <p><strong>Thanks for checking it out!</strong></p>

                        <p style={{marginTop: '10%'}}>
                            Made with ❤️ by:
                        </p>

                        <p>
                            <a href={'https://github.com/incredX'} target={'_blank'}>Raul Agolli</a>
                        </p>
                        <p>
                            <a href={'https://github.com/DavideGhiiso'} target={'_blank'}>Davide Ghisolfi</a>
                        </p>
                        <p>
                            <a href={'https://github.com/Zendikcar'} target={'_blank'}>Gioele Guaiumi</a>
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
}

export default About
