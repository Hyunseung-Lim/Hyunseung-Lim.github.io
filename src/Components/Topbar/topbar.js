import React from 'react'
import '../components.css'
import './topbar.css'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

export const Topbar = ({ hideThemeToggle = false }) => {
    return(
        <nav className='topbar'>
            <div className='contents'>
                <a href="#/" className='logo-link'>Hyunseung Lim</a>
                <input className="burger-check" type="checkbox" id="burger-check" /><label className="burger-icon" htmlFor="burger-check"><span className="burger-sticks"></span></label>
                <div className='menu'>
                    <a href="#/" className='hamburger-bar'>About Me</a>
                    <a href="#/projects" className='hamburger-bar'>Projects</a>
                    <a href="#/publications" className='hamburger-bar'>Publications</a>
                    {!hideThemeToggle && <ThemeToggle isMobile={true} />}
                </div>
                <div className='links'>
                    <a href="#/">About Me</a>
                    <a href="#/projects">Projects</a>
                    <a href="#/publications">Publications</a>
                    {!hideThemeToggle && <ThemeToggle />}
                </div>
            </div>
        </nav>
    )
}