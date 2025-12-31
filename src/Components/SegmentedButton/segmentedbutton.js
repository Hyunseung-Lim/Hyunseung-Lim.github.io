import React, { useState, useEffect, useRef, useCallback } from "react";
import "./segmentedbutton.css";

const isDefined = (value) => value !== undefined && value !== null;

export const SegmentedControl = ({ name, callback, controlRef, segments = [], value }) => {
    const [internalValue, setInternalValue] = useState(() => {
        if (isDefined(value)) {
            return value;
        }
        return segments[0]?.value ?? null;
    });
    const [sliderStyle, setSliderStyle] = useState({});
    const buttonRefs = useRef([]);

    const updateSliderPosition = useCallback((index) => {
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
    }, []);

    const resolvedValue = isDefined(value) ? value : internalValue;
    const hasSelection = segments.some((segment) => segment.value === resolvedValue);
    const activeValue = hasSelection ? resolvedValue : (segments[0]?.value ?? null);
    const activeIndex = Math.max(
        0,
        segments.findIndex((segment) => segment.value === activeValue)
    );

    const handleSegmentClick = (index, segmentValue) => {
        if (!isDefined(value)) {
            setInternalValue(segmentValue);
        }
        updateSliderPosition(index);
        if (callback) {
            callback(segmentValue);
        }
    };

    useEffect(() => {
        if (!isDefined(value) && internalValue !== activeValue) {
            setInternalValue(activeValue);
        }
    }, [activeValue, internalValue, value]);

    useEffect(() => {
        const timer = setTimeout(() => updateSliderPosition(activeIndex), 0);
        return () => clearTimeout(timer);
    }, [activeIndex, segments, updateSliderPosition]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        // 윈도우 리사이즈 시 슬라이더 위치 재조정
        const handleResize = () => {
            updateSliderPosition(activeIndex);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [activeIndex, updateSliderPosition]);

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
