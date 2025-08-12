import React, { useState, useEffect, useRef } from 'react';
import { Topbar } from '../Components/Topbar/topbar';
import { Footer } from '../Components/Footer/footer';
import './pages.css';

export const MainPage = () => {
  // 원본 이미지 목록
  const images = [
    '/images/banner/dis2024/img1.jpg',
    '/images/banner/dis2024/img2.jpg',
    '/images/banner/dis2024/img3.jpg',
    '/images/banner/dis2024/img4.jpg',
    '/images/banner/dis2024/img5.jpg',
    '/images/banner/dis2024/img6.jpg',
    '/images/banner/dis2024/img7.jpg'
  ];

  // 무한 슬라이드를 위해 앞뒤로 복제 추가 [마지막, 원본들, 첫번째]
  const extendedImages = [images[images.length - 1], ...images, images[0]];
  
  const [currentIndex, setCurrentIndex] = useState(1); // 1부터 시작 (첫 번째 원본 이미지)
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 슬라이드 전환 함수
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  
  // 5초마다 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning]);
  
  // 트랜지션이 끝난 후 처리
  useEffect(() => {
    if (!isTransitioning) return;
    
    const transitionEndHandler = () => {
      setIsTransitioning(false);
      
      // 마지막 복제 이미지에 도달하면 첫 번째 원본 이미지로 순간이동
      if (currentIndex === extendedImages.length - 1) {
        setTimeout(() => {
          setCurrentIndex(1);
        }, 0);
      }
      
      // 첫 번째 복제 이미지에 도달하면 마지막 원본 이미지로 순간이동
      if (currentIndex === 0) {
        setTimeout(() => {
          setCurrentIndex(images.length);
        }, 0);
      }
    };
    
    const timeout = setTimeout(transitionEndHandler, 1000); // 1초 트랜지션 후 실행
    return () => clearTimeout(timeout);
  }, [currentIndex, extendedImages.length, images.length, isTransitioning]);

  return (
    <div className="mainPage">
      <Topbar />

      <div className="banner">
        <div className="slider-container">
          <div
            className="slider"
            style={{
              width: `${extendedImages.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / extendedImages.length}%)`,
              transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
            }}
          >
            {extendedImages.map((src, index) => (
              <div 
                className="slide" 
                key={index}
                style={{ width: `${100 / extendedImages.length}%` }}
              >
                <img src={src} alt={`Slide ${index}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="banner-text">
          <div>DIS 2024</div>
          <div>Denmark Copenhagen</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};