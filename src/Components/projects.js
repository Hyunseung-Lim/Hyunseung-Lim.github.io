import React from 'react'
import './components.css'
import projectData from '../Data/projects.json'


export const Projects = (props) => {
    return(
        <div className="projects">
            <div className='title'>Projects</div>
            <div className='projectlist'>
                {projectData.map(project => (
                        <div className='project' key={project.title}>
                                <img src={'images/' + project.image} alt={project.title}/>
                                <div className='projectcontents'>
                                    <span className='title'>
                                        <span>{project.title}</span>
                                        <span className='year'> ({project.year})</span>
                                    </span>
                                    <div className='authors'>{project.people.map((person, index) => 
                                        <span className='authorholder'>
                                            <span className={project.highlight_people.includes(index) ? "highlight_person" : "person"}>{person}</span>
                                            {index < project.people.length - 1 ? ', ' : ''}
                                        </span>
                                    )}</div>
                                    <div className='description'>{project.description}</div>
                                </div>

                        </div>
                    ))}
            </div>
        </div>
    )
}