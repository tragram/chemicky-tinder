import React, { useRef, useMemo } from 'react';
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
    const activeCard = useRef(0);
    const swipedRight = useRef(0);
    const nrMatched = useRef(0);

    const sortedProfiles = useMemo(() => {
        return [...profiles].sort(() => Math.random() - 0.5);
    }, []);
    const handleSwipe = (direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            swipedRight.current = swipedRight.current + 1;
            if (Math.random() <= matchProbability(profiles.length, profiles.length - activeCard.current, nrMatched.current, swipedRight.current)) {
                nrMatched.current = nrMatched.current + 1;
                onMatch(swipedProfile);
            }
        }
        activeCard.current = activeCard.current + 1;
    };

    return (
        <div className="relative w-full h-full flex justify-center items-center overscroll-contain">
            {sortedProfiles.map((profile, index) => (
                <TinderCard
                    key={profile.id()}
                    zIndex={profiles.length - index}
                    index={index}
                    activeCardRef={activeCard}
                    profile={profile}
                    onSwipe={handleSwipe}
                />
            ))}
        </div>
    );
};

export default TinderStack;
