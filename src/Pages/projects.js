import React from 'react'
import '../Components/components.css'
import './pages.css'
import { useFadeInAnimation } from '../hooks/useFadeInAnimation'
import projectData from '../Data/projects.json'


export const Projects = () => {
    const fadeInRef = useFadeInAnimation();
    
    return(
        <div className="page">
            <div className="projects">
                <div ref={fadeInRef} className='title'>Projects</div>
                <div className='projectlist'>
                    {projectData.map(project => (
                        <div ref={fadeInRef} className='project-item bibliography' key={project.title}>
                            <div className='proj-title pub-title'>{project.title} ({project.year})</div>
                            <div className='proj-authors pub-authors'>
                                {project.people.map((person, index) => (
                                    <span key={index} className='authorholder'>
                                        <span className={project.highlight_people.includes(index) ? "highlight_person" : "person"}>
                                            {project.highlight_people.includes(index) ? <strong>{person}</strong> : person}
                                        </span>
                                        {index < project.people.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                            <div className='proj-description pub-others'>
                                <div className='proj-desc-text'>{project.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}