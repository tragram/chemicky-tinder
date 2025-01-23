import React, { useState } from 'react';
import TinderCard from './TinderCard';

const TinderStack = ({ profiles, onSwipe }) => {
    const [cards, setCards] = useState(profiles);

    const handleSwipe = (direction, swipedProfile) => {
        setCards(prevCards =>
            prevCards.filter(profile => profile !== swipedProfile)
        );

        onSwipe?.(direction, swipedProfile);
    };

    return (
        <div className="relative w-full h-full flex justify-center items-center overscroll-contain touch-none">
            {cards.map((profile, index) => (
                <TinderCard
                    key={index}
                    profile={profile}
                    onSwipe={handleSwipe}
                    style={{
                        zIndex: cards.length - index, 
                    }}
                />
            ))}
        </div>
    );
};

export default TinderStack;