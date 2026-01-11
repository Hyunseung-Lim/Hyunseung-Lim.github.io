import React from 'react';
import { Link } from 'react-router-dom';
import '../components.css';
import './topbar.css';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

export const Topbar = ({ hideThemeToggle = false }) => {
    return(
        <nav className='topbar'>
            <div className='contents'>
                <Link to="/" className='logo-link'>Hyunseung Lim</Link>
                <input className="burger-check" type="checkbox" id="burger-check" /><label className="burger-icon" htmlFor="burger-check"><span className="burger-sticks"></span></label>
                <div className='menu'>
                    <Link to="/about" className='hamburger-bar'>About Me</Link>
                    <Link to="/projects" className='hamburger-bar'>Projects</Link>
                    <Link to="/publications" className='hamburger-bar'>Publications</Link>
                    {!hideThemeToggle && <ThemeToggle isMobile={true} />}
                </div>
                <div className='links'>
                    <Link to="/about">About Me</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/publications">Publications</Link>
                    {!hideThemeToggle && <ThemeToggle />}
                </div>
            </div>
        </nav>
    )
}
