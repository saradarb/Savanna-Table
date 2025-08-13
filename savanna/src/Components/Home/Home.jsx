
import './Home.css';
import React, { useState, useRef, useEffect } from 'react';
import one from '../../assets/Images/1.png'
import two from '../../assets/Images/2.png'
import three from '../../assets/Images/3.png'
import four from '../../assets/Images/4.png'
import five from '../../assets/Images/5.png'
import six from '../../assets/Images/6.png'
import seven from '../../assets/Images/7.png'
import eight from '../../assets/Images/8.png'


const Home = () => {
  const items = [
    { src: one, alt: 'Dish 1' },
    { src: two, alt: 'Dish 2' },
    { src: three, alt: 'Dish 3' },
    { src: four, alt: 'Dish 4' },
    { src: five, alt: 'Dish 5' },
    { src: six, alt: 'Dish 6' },
    { src: seven, alt: 'Dish 6' },
    { src: eight, alt: 'Dish 6' },
  ];
  

  const circleText =
    'Rooted in bold flavor - Inspired by wild lands - Gather, taste, and connect';

  const [active, setActive] = useState(1);
  const listRef = useRef(null);
  const itemWidth = useRef(0);

  useEffect(() => {
    if (listRef.current && listRef.current.children.length > 0) {
      itemWidth.current = listRef.current.children[0].offsetWidth;
      runCarousel();
    }
    // eslint-disable-next-line
  }, [active]);

  const runCarousel = () => {
    const list = listRef.current;
    if (!list) return;

    const leftTransform = itemWidth.current * (active - 1) * -1;
    list.style.transform = `translateX(${leftTransform}px)`;
  };

  const handleNext = () => {
    setActive((prev) => (prev >= items.length - 1 ? items.length - 1 : prev + 1));
  };

  const handlePrev = () => {
    setActive((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  return (
    <>
      <header>
        <div className="top-title">
          <a href="/">Savanna Table Restaurant</a>
        </div>
        <nav>
          <ul className="top-title">
          <li><a href="/OrderOnline">Order Online</a></li>
            <li><a href="/reservation">Reservation</a></li>
            <li><a href="/contactUs">Contact Us</a></li>
          </ul>
        </nav>
      </header>

      <div className="slider">
        <div className="list" ref={listRef}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`item ${index === active ? 'active' : ''}`}
            >
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>

        <div className="circle">
          {circleText.split('').map((char, index) => (
            <span
              key={index}
              style={{
                '--rotate': `${(360 / circleText.length) * (index + 1)}deg`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div className="content">
          <div></div>
          <div className="mainTitle">Savanna Table</div>
        </div>

        <div className="arow">
          {active > 0 && (
            <button id="prev" onClick={handlePrev}>
              &lt;
            </button>
          )}
          {active < items.length - 1 && (
            <button id="next" onClick={handleNext}>
              &gt;
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

