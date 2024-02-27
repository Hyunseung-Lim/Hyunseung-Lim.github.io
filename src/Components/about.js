import React from 'react'
import './components.css'

export const About = (props) => {
    return(
        <div className="about">
            <img src={'images/photo.png'} alt="profile"/>
            <div className='contents'>
                <div className='greeting'>Hi, I'm Hyunseung Lim! 🍀</div>
                <div className='description'>Hello! I am a second year PhD candidate in the Department of Industrial Design at KAIST. I am working with <a href='https://galaxytourist.notion.site/galaxytourist/Hwajung-Hong-cc10b0291bbe4ca38dbf4882cd687423'>Prof. Hwajung Hong</a> at <a href='https://dxd-lab.github.io/'>DxD Lab</a>. <br/><br/> My research interest sits at the intersection of Human-AI Interaction and Accessibility, with a strong emphasis on a Human-Centered design approach.</div>
                <div className='icons'>
                    <a href='mailto:charlie9807@kaist.ac.kr'><img src="/icons/mail.svg" alt="mail"/></a>
                    <a href='https://scholar.google.com/citations?user=3h9XkqYAAAAJ&hl=ko&oi=ao'><img src="/icons/scholar.svg" alt="scholar"/></a>
                    <a href='https://scholar.google.com/citations?user=3h9XkqYAAAAJ&hl=ko&oi=ao'><img src="/icons/linkedin.svg" alt="linkedin"/></a>
                    <a href='PDF/CV.pdf'><img src="/icons/cv.svg" alt="cv"/></a>
                    <a href='https://scholar.google.com/citations?user=3h9XkqYAAAAJ&hl=ko&oi=ao'><img src="/icons/instagram.svg" alt="instagram"/></a>
                    <a href='https://scholar.google.com/citations?user=3h9XkqYAAAAJ&hl=ko&oi=ao'><img src="/icons/github.svg" alt="github"/></a>
                </div>
            </div>
        </div>
    )
}