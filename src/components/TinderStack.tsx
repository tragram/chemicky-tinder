import React, { useState, useCallback, useRef, useMemo } from 'react';
import TinderCard from './TinderCard/TinderCard';
import { TinderProfile } from '@/types';
import BottomCard from './TinderCard/BottomCard';

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

    // Memoize the sorted profiles array so that it's not changed on every render
    const sortedProfiles = useMemo(() => {
        return [...profiles].sort(() => Math.random() - 0.5);
    }, []);

    const handleSwipe = (direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            swipedRight.current = swipedRight.current + 1;
            if (Math.random() <= matchProbability(profiles.length, profiles.length - activeCard, nrMatched.current, swipedRight.current)) {
                nrMatched.current = nrMatched.current + 1;
                onMatch(swipedProfile);
            }
        }
        setActiveCard(activeCard + 1);
    };

    return (
        <div className="relative w-full h-full flex justify-center items-center overscroll-contain">
            {/* <BottomCard cardActive={true} zIndex={100}/> */}
            {sortedProfiles.map((profile, index) => (
                <TinderCard
                    key={profile.id()}
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