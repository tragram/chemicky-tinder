import React, { useState, useCallback } from 'react';
import TinderCard from './TinderCard';
import { TinderProfile } from '@/types';

interface TinderStackProps {
    profiles: TinderProfile[];
    onMatch: (matchedProfile: TinderProfile) => void;
}

const TinderStack: React.FC<TinderStackProps> = ({ profiles, onMatch }) => {
    const [cards, setCards] = useState(profiles);
    const [swipedRight, setSwipedRight] = useState(0);

    const handleSwipe = useCallback((direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            const newSwipedRight = swipedRight + 1;
            setSwipedRight(newSwipedRight);
            if (newSwipedRight >= 2) {
                onMatch(swipedProfile);
            }
        }

    }, [swipedRight, cards]);



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