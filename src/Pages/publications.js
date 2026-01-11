import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Components/components.css';
import './pages.css';
import { SegmentedControl } from '../Components/SegmentedButton/segmentedbutton';
import { useFadeInAnimation } from '../hooks/useFadeInAnimation';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import publicationData from '../Data/publications.json';
import personLinks from '../Data/personLinks.json';

const PROJECT_WEB_ROUTES = {
    'PANORAMA: A Dataset and Benchmarks Capturing Decision Trails and Rationales in Patent Examination': '/projects/panorama',
    'Feed-O-Meter: Investigating AI-Generated Mentee Personas as Interactive Agents for Scaffolding Design Feedback Practice': '/projects/feed-o-meter',
    'How Do Users Identify and Perceive Stereotypes? Understanding User Perspectives on Stereotypical Biases in Large Language Models': '/projects/stereohunter',
    'Co-Creating Question-and-Answer Style Articles with Large Language Models for Research Promotion': '/projects/aqua',
    'Elevate: A Walkable Pin-Array for Large Shape-Changing Terrains': '/projects/elevate',
    'Elevate: a large-scale walkable pin-array display': '/projects/elevate'
};

export const Publications = (props) => {
    const fadeInRef = useFadeInAnimation();


    const [isMobile, setIsMobile] = useState(Number(window.innerWidth <= 992));
    
    // Create all refs at component top level
    const fieldControlRef = useRef();
    const typeControlRef = useRef();
    const allRef1 = useRef();
    const haiRef1 = useRef();
    const llmRef1 = useRef();
    const othersRef1 = useRef();
    const allRef2 = useRef();
    const haiRef2 = useRef();
    const llmRef2 = useRef();
    const creativityRef = useRef();
    const learningRef = useRef();
    const ethicsRef = useRef();
    const othersRef2 = useRef();
    const allRef3 = useRef();
    const firstAuthorRef1 = useRef();
    const fullPaperRef = useRef();
    const othersRef3 = useRef();
    const allRef4 = useRef();
    const firstAuthorRef2 = useRef();
    const conferenceRef = useRef();
    const journalRef = useRef();
    const posterRef = useRef();
    const workshopRef = useRef();
    const preprintRef = useRef();
    

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(Number(window.innerWidth <= 992));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [fieldValue, setFieldValue] = useState("all");
    const [typeValue, setTypeValue] = useState("all");
    const [yearList, setYearList] = useState([]);
    const [filteredPublications, setFilteredPublications] = useState([]);

    const renderAuthorName = (name, index) => {
        const trimmed = name.trim();
        if (!trimmed) return null;

        const link = personLinks[trimmed];
        const isHighlighted = trimmed === 'Hyunseung Lim';
        const classNames = [];
        if (isHighlighted) classNames.push('highlight_author');

        if (link) {
            classNames.push('author-link');
            return (
                <a
                    href={link}
                    className={classNames.join(' ') || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {trimmed}
                </a>
            );
        }

        return (
            <span className={classNames.join(' ') || undefined}>
                {trimmed}
            </span>
        );
    };

    const renderAuthors = (authorString) => {
        if (!authorString) {
            return null;
        }

        const authors = authorString.split(',').map((name) => name.trim()).filter(Boolean);
        if (authors.length === 0) {
            return null;
        }

        if (isMobile && authors.length > 6) {
            const displayedAuthors = authors.slice(0, 4);
            const remainingCount = authors.length - displayedAuthors.length;
            const fragments = displayedAuthors.map((name, index) => (
                <React.Fragment key={`${name}-${index}`}>
                    {index > 0 && ', '}
                    {renderAuthorName(name, index)}
                </React.Fragment>
            ));
            fragments.push(
                <React.Fragment key="more-authors">
                    , and {remainingCount} more authors
                </React.Fragment>
            );
            return fragments;
        }

        return authors.map((name, index) => (
            <React.Fragment key={`${name}-${index}`}>
                {index > 0 && ', '}
                {renderAuthorName(name, index)}
            </React.Fragment>
        ));
    };

    function getYear(currentPubs) {
        let newYearList = [];
        for (let i = 0; i < currentPubs.length; i++) {
            if (currentPubs[i].year && currentPubs[i].year > 0 && !newYearList.includes(currentPubs[i].year)) {
                newYearList = [...newYearList, currentPubs[i].year];
            }
        }
        return newYearList.sort((a, b) => b - a);
    }

    useEffect(() => {
        const validData = publicationData.filter(pub => pub.title && pub.year > 0);
        const years = getYear(validData);
        setYearList(years);
        setFilteredPublications(validData);
    }, []);

    useEffect(() => {
        let filteredData = publicationData.filter(pub => pub.title && pub.year > 0);

        if (fieldValue !== "all") {
            filteredData = filteredData.filter(pub => 
                pub.field && (
                    pub.field.includes(fieldValue) ||
                    (fieldValue === "others_field" && !pub.field.includes("hai") && !pub.field.includes("llm"))
                )
            );
        }

        if (typeValue !== "all") {
            if (typeValue === "first_author") {
                filteredData = filteredData.filter(pub => 
                    pub.author && pub.author.startsWith("Hyunseung Lim")
                );
            } else if (typeValue === "full_paper") {
                filteredData = filteredData.filter(pub => 
                    pub.type === "conference" || pub.type === "journal"
                );
            } else if (typeValue === "others_pub") {
                filteredData = filteredData.filter(pub => 
                    pub.type === "poster" || pub.type === "workshop" || pub.type === "preprint"
                );
            } else {
                filteredData = filteredData.filter(pub => pub.type === typeValue);
            }
        }

        const newYears = getYear(filteredData);
        setYearList(newYears);
        setFilteredPublications(filteredData);
    }, [fieldValue, typeValue]);

    return(
        <>
            <Topbar/>
            <div className='page'>
                <div className="publications">
                    <div ref={fadeInRef} className={`selection ${isMobile ? 'selection--mobile' : ''}`}>
                        <SegmentedControl
                            name="field"
                            callback={(val) => setFieldValue(val)}
                            controlRef={fieldControlRef}
                            segments={isMobile ? [
                                {label: "All", value: "all", ref: allRef1},
                                {label: "HAI", value: "hai", ref: haiRef1},
                                {label: "LLM", value: "llm", ref: llmRef1},
                                {label: "Others", value: "others_field", ref: othersRef1}
                            ] : [
                                {label: "All", value: "all", ref: allRef2},
                                {label: "HAI", value: "hai", ref: haiRef2},
                                {label: "LLM", value: "llm", ref: llmRef2},
                                {label: "Creativity", value: "creativity", ref: creativityRef},
                                {label: "Learning", value: "learning", ref: learningRef},
                                {label: "AI Ethics", value: "ethics", ref: ethicsRef},
                                {label: "Others", value: "others", ref: othersRef2}
                            ]}
                        />
                        <SegmentedControl
                            name="type"
                            callback={(val) => setTypeValue(val)}
                            controlRef={typeControlRef}
                            segments={isMobile ? [
                                {label: "All", value: "all", ref: allRef3},
                                {label: "First Author", value: "first_author", ref: firstAuthorRef1},
                                {label: "Full Paper", value: "full_paper", ref: fullPaperRef},
                                {label: "Others", value: "others_pub", ref: othersRef3}
                            ] : [
                                {label: "All", value: "all", ref: allRef4},
                                {label: "First Author", value: "first_author", ref: firstAuthorRef2},
                                {label: "Conference", value: "conference", ref: conferenceRef},
                                {label: "Journal", value: "journal", ref: journalRef},
                                {label: "Poster", value: "poster", ref: posterRef},
                                {label: "Workshop", value: "workshop", ref: workshopRef},
                                {label: "Preprint", value: "preprint", ref: preprintRef}
                            ]}
                        />                    
                    </div>
                    <div className='publicationlist'>
                        {yearList.map(year =>
                            <div key={year}>
                                <div ref={fadeInRef} className="year">{year}</div>
                                {filteredPublications.filter(pub => pub.year === year && pub.title && pub.year > 0).map(publication =>
                                    <div key={publication.title + (publication.authors?.join('') || publication.author || '')} className="publication">
                                        <div ref={fadeInRef} className="info">
                                            <div className="maininfo">
                                                <div ref={fadeInRef} className="title">{publication.title}</div>
                                                <div ref={fadeInRef} className="authors">
                                                    {renderAuthors(publication.author)}
                                                </div>
                                                <div ref={fadeInRef} className="venue-links">
                                                    <span className="venue-text">{publication.venue}</span>
                                                    {(() => {
                                                        const linkEntries = [];
                                                        const addLink = ({ key, href, label, newTab = true, primary = false }) => {
                                                            if (!href) return;
                                                            const classNames = ['venue-link'];
                                                            if (primary) classNames.push('venue-link--primary');
                                                            const isInternal = !newTab && href.startsWith('/');
                                                            let element;
                                                            if (isInternal) {
                                                                element = (
                                                                    <Link key={key} to={href} className={classNames.join(' ')}>
                                                                        {label}
                                                                    </Link>
                                                                );
                                                            } else {
                                                                const props = {};
                                                                if (newTab) {
                                                                    props.target = '_blank';
                                                                    props.rel = 'noopener noreferrer';
                                                                }
                                                                element = (
                                                                    <a key={key} href={href} className={classNames.join(' ')} {...props}>
                                                                        {label}
                                                                    </a>
                                                                );
                                                            }
                                                            linkEntries.push({
                                                                key,
                                                                primary,
                                                                element
                                                            });
                                                        };

                                                        const projectRoute = PROJECT_WEB_ROUTES[publication.title];
                                                        if (projectRoute) {
                                                            addLink({ key: 'project-web', href: projectRoute, label: 'WEB', newTab: false, primary: true });
                                                        }
                                                        if (publication.pdf) addLink({ key: 'pdf', href: `/PDF/${publication.pdf}`, label: 'PDF', primary: true });
                                                        if (publication.doi) addLink({ key: 'doi', href: publication.doi, label: 'DOI' });
                                                        if (publication.link) addLink({ key: 'link', href: publication.link, label: 'LINK' });
                                                        if (publication.recording) addLink({ key: 'recording', href: publication.recording, label: 'REC' });
                                                        if (publication.video) addLink({ key: 'video', href: publication.video, label: 'VID' });
                                                        if (publication.bibtex) addLink({ key: 'bib', href: `/bib/${publication.bibtex}`, label: 'BIB' });

                                                        const visibleEntries = isMobile
                                                            ? linkEntries.filter(entry => entry.primary)
                                                            : linkEntries;

                                                        return visibleEntries.map((entry, index) => (
                                                            <React.Fragment key={entry.key}>
                                                                {index > 0 && <span className="separator"> • </span>}
                                                                {entry.element}
                                                            </React.Fragment>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        {publication.award && (
                                            <div ref={fadeInRef} className="awards">
                                                <span className="award">{publication.award}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
