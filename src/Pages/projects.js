import '../Components/components.css'
import './pages.css'
import { useFadeInAnimation } from '../hooks/useFadeInAnimation'

export const Projects = () => {
    const fadeInRef = useFadeInAnimation();

    // Static project data for main projects page
    const projectData = [
        {
            title: "Datopia",
            people: ["Hyunseung Lim", "Dasom Choi", "Kwangyoung Lee", "Taewan Kim", "Eunseo Oh", "Inhwa Song", "Seokyoung Park", "Yubin Choi", "Hwajung Hong"],
            period: "2022",
            status: "Completed",
            projectType: "Exhibition",
            description: "Datopia is a data-based dating service. By analyzing data, it captures everything from the preferences you didn't know you had to your minor daily habits. Through this, it goes beyond simple encounters to find you a destined partner with whom you can maintain a continuous relationship. But can love really be determined solely by data?",
            image: "project_1.png"
        }
    ];

    return(
        <div className="page">
            <div className="projects">
                <div ref={fadeInRef} className='title'>Projects</div>
                <div className='projectlist'>
                    {projectData.map(project => (
                        <div ref={fadeInRef} className='project-item bibliography' key={project.title}>
                            <a href={`#/projects/${project.title.toLowerCase()}`} className='project-link'>
                                <div className='proj-title pub-title'>{project.title} ({project.period})</div>
                                <div className='proj-meta'>
                                    <span className='proj-status'>{project.status}</span>
                                    {project.status && project.projectType && ' • '}
                                    <span className='proj-type'>{project.projectType}</span>
                                </div>
                                <div className='proj-authors pub-authors'>
                                    {project.people.map((person, index) => (
                                        <span key={index} className='authorholder'>
                                            <span className={person === "Hyunseung Lim" ? "highlight_person" : "person"}>
                                                {person === "Hyunseung Lim" ? <strong>{person}</strong> : person}
                                            </span>
                                            {index < project.people.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                                <div className='proj-description pub-others'>
                                    <div className='proj-desc-text'>{project.description}</div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}