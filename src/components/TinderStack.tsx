import React, { useState, useCallback, useRef } from 'react';
import TinderCard from './TinderCard/TinderCard';
import { TinderProfile } from '@/types';

interface TinderStackProps {
    profiles: TinderProfile[];
    onMatch: (matchedProfile: TinderProfile) => void;
}

const matchProbability = (totalProfileNr: number, profilesLeft: number, matchedAlready: number, swipedRightNr: number) => {
    return (
        (((totalProfileNr - profilesLeft) / totalProfileNr) ** 2 + (swipedRightNr / 10) ** 2) / (matchedAlready + 1) ** 2
    );
}

const TinderStack: React.FC<TinderStackProps> = ({ profiles, onMatch }) => {
    const [activeCard, setActiveCard] = useState(0);
    const swipedRight = useRef(0);
    const nrMatched = useRef(0);
    const handleSwipe = useCallback((direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            swipedRight.current = swipedRight.current + 1;
            if (Math.random() <= matchProbability(profiles.length, profiles.length - activeCard, nrMatched.current, swipedRight.current)) {
                nrMatched.current = nrMatched.current + 1;
                onMatch(swipedProfile);
            }
        }
        setActiveCard(activeCard + 1);
    }, [swipedRight, activeCard]);
    return (
        <div className="relative w-full h-full flex justify-center items-center overscroll-contain">
            {profiles.map((profile, index) => (
                <TinderCard
                    key={index}
                    zIndex={profiles.length - index}
                    cardActive={activeCard === index}
                    profile={profile}
                    onSwipe={handleSwipe}
                />
            ))}
        </div>
    );
};

export default TinderStack;