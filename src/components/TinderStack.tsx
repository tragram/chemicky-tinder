import React, { useState } from 'react';
import TinderCard from './TinderCard';
import { TinderProfile } from '@/types';

interface TinderStackProps {
    profiles: TinderProfile[];
}

const TinderStack: React.FC<TinderStackProps> = ({ profiles }) => {
    const [cards, setCards] = useState(profiles);

    const handleSwipe = (direction, swipedProfile) => {
        setCards(prevCards =>
            prevCards.filter(profile => profile !== swipedProfile)
        );
    };

    return (
        <div className="relative w-full h-full flex justify-center items-center overscroll-contain touch-none">
            {cards.map((profile, index) => (
                <TinderCard
                    key={index}
                    profile={profile}
                    onSwipe={handleSwipe}
                />
            ))}
        </div>
    );
};

export default TinderStack;