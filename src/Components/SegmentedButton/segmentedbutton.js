import React, { useState, useEffect, useRef } from "react";
import "./segmentedbutton.css";

export const SegmentedControl = ({ name, callback, controlRef, segments }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliderStyle, setSliderStyle] = useState({});
    const buttonRefs = useRef([]);

    const handleSegmentClick = (index, value) => {
        setActiveIndex(index);
        updateSliderPosition(index);
        if (callback) {
            callback(value);
        }
    };

    const updateSliderPosition = (index) => {
        const button = buttonRefs.current[index];
        if (button) {
            const { offsetLeft, offsetWidth } = button;
            const parentPadding = 4; // segmented-control padding
            setSliderStyle({
                transform: `translateX(${offsetLeft - parentPadding}px)`,
                width: `${offsetWidth}px`,
                left: `${parentPadding}px`
            });
        }
    };

    useEffect(() => {
        // 초기 슬라이더 위치 설정
        setTimeout(() => updateSliderPosition(0), 100);
        
        if (callback && segments[0]) {
            callback(segments[0].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 윈도우 리사이즈 시 슬라이더 위치 재조정
        const handleResize = () => {
            updateSliderPosition(activeIndex);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeIndex]);

    return (
        <div className="segmented-control" ref={controlRef}>
            <div className="slider" style={sliderStyle}></div>
            {segments.map((segment, index) => (
                <button
                    key={segment.value}
                    ref={(el) => {
                        buttonRefs.current[index] = el;
                        if (segment.ref) segment.ref.current = el;
                    }}
                    className={`segmented-button ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => handleSegmentClick(index, segment.value)}
                >
                    {segment.label}
                </button>
            ))}
        </div>
    );
};