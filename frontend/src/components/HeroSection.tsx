import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronsDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroData = [
  {
    title: 'Elite Trading Hub!',
    subtitle: 'Welcome to',
    description:
      'Start your journey to mastering Forex Trading with one of the best in the world! Go from a beginner to an advanced FX trader with the one and only Mohammed Abdirahman. Enroll now to gain access to over 80 in-depth courses that carefully explains the extreme complexities of the forex market.',
    primaryLink: { to: '/plans', label: 'Enroll with us now', icon: <ChevronsDown className="ml-2" />,  },
    secondaryLink: { href: 'https://t.me/elitecommunitytraders', label: 'Get forex signals', icon: <ArrowUpRight className="ml-2" />, external: true },
    slideImages: [
      '/images/photo_1.jpg',
    ],
    primaryColor: 'bg-blue-600',
  },
  {
    title: (
      <>
        Watch Mohammed Abdirahman trade <br /> forex seamlessly...
      </>
    ),
    subtitle: '',
    description:
      'Take the first class for free and watch one of the best forex trader in the world introduce you to the academy!',
    primaryLink: { to: '/tour', label: 'Take a free tour', icon: <ArrowRight className="ml-2" /> },
    secondaryLink: { to: '/signal-results', label: '',  icon: null },
    slideImages: [
      '/images/photo_3.jpg',
    ],
    primaryColor: 'bg-green-600',
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Duplicate slides to fake infinite effect
  const extendedSlides = [...heroData, ...heroData];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Reset without animation if at the end
  useEffect(() => {
    if (index === heroData.length * 2) {
      setTimeout(() => {
        setTransitionEnabled(false); // disable animation
        setIndex(0); // reset to start
      }, 1000); // after animation completes

      setTimeout(() => {
        setTransitionEnabled(true); // re-enable for next scroll
      }, 1100); // just after reset
    }
  }, [index]);

  return (
    <section id="top">
      <div className="relative w-screen h-screen overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex w-fit h-full ${
            transitionEnabled ? 'transition-transform duration-1000 ease-in-out' : ''
          }`}
          style={{
            transform: `translateX(-${index * 100}vw)`,
          }}
        >
          {extendedSlides.map((hero, i) => (
            <div
              key={i}
              className="w-screen h-screen flex-shrink-0 relative bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.slideImages[0]})` }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: 'linear-gradient(to top, rgba(65, 65, 65, 0.8), rgba(35, 33, 33, 0.4), transparent)',
                }}
              />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4 text-center">
                <p className="text-xl md:text-4xl font-medium mb-2">{hero.subtitle}</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero.title}</h1>
                <p className="text-sm md:text-base max-w-2xl mb-8">{hero.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {hero.primaryLink.label && (
                    <Link
                      to={hero.primaryLink.to}
                      style={{
                        backgroundColor: 'rgb(0, 128, 0)',
                        borderColor: 'rgb(0, 128, 0)',
                        borderBottomRightRadius: 0, // remove rounding from bottom-right
                      }}
                      className="hover:bg-white hover:text-black font-bold text-white px-6 py-3 font-medium transition-colors rounded-2xl opacity-70"
                    >
                      <span className="flex items-center text-sm font-bold gap-2">
                        {hero.primaryLink.label}
                        {hero.primaryLink.icon}
                      </span>
                    </Link>
                  )}
                  {hero.secondaryLink.label && (
                    hero.secondaryLink.external ? (
                      <a
                        href={hero.secondaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          border: '2px solid white',
                          backgroundColor: 'transparent',
                          borderBottomRightRadius: 0,
                        }}
                        className="flex items-center gap-2 px-10 py-4 hover:bg-white hover:text-black text-white font-medium transition-colors rounded-2xl"
                      >
                        {hero.secondaryLink.label}
                        {hero.secondaryLink.icon}
                      </a>
                    ) : (
                      <Link
                        to={hero.secondaryLink.to}
                        style={{
                          border: '2px solid white',
                          backgroundColor: 'transparent',
                          borderBottomRightRadius: 0,
                        }}
                        className="flex items-center gap-2 px-10 py-4 hover:bg-white hover:text-black text-white font-medium transition-colors rounded-2xl"
                      >
                        {hero.secondaryLink.label}
                        {hero.secondaryLink.icon}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;