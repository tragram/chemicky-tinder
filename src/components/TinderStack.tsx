import React, { useRef, useMemo, act, useState } from 'react';
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
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const swipedRight = useRef(0);
    const nrMatched = useRef(0);
    const [atTheEnd, setAtTheEnd] = useState(false);

    const sortedProfiles = useMemo(() => {
        return [...profiles].sort(() => Math.random() - 0.5);
    }, []);

    const handleSwipe = (direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            swipedRight.current = swipedRight.current + 1;
            if (Math.random() <= matchProbability(profiles.length, profiles.length - activeCardIndex, nrMatched.current, swipedRight.current)) {
                nrMatched.current = nrMatched.current + 1;
                onMatch(swipedProfile);
            }
        }
        setActiveCardIndex(prev => prev + 1);
        if (activeCardIndex + 1 === profiles.length) setAtTheEnd(true);
    };

    return (
        <div className="relative z-auto w-full h-full flex justify-center items-center overscroll-contain">
            <BottomCard cardActive={atTheEnd} zIndex={0} />
            {sortedProfiles.map((profile, index) => (
                <TinderCard
                    key={profile.id()}
                    zIndex={profiles.length - index}
                    index={index}
                    isActive={activeCardIndex === index}
                    profile={profile}
                    onSwipe={handleSwipe}
                />
            ))}
        </div>
    );
};

export default TinderStack;
