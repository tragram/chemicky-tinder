import React, { useState, useCallback } from 'react';
import TinderCard from './TinderCard';
import MatchScreen from './MatchScreen';
import { TinderProfile } from '@/types';

interface TinderStackProps {
    profiles: TinderProfile[];
}

const TinderStack: React.FC<TinderStackProps> = ({ profiles }) => {
    const [cards, setCards] = useState(profiles);
    const [swipedRight, setSwipedRight] = useState(0);
    const [matchedProfile, setMatchedProfile] = useState<TinderProfile | null>(null);

    const handleSwipe = useCallback((direction: string, swipedProfile: TinderProfile) => {
        if (direction === 'right') {
            const newSwipedRight = swipedRight + 1;
            setSwipedRight(newSwipedRight);

            if (newSwipedRight === 2) {
                // Trigger match screen with the current and previous right-swiped profile
                const previousRightSwipeIndex = cards.findIndex(p => p === swipedProfile) - 1;
                const previousRightSwipeProfile = cards[previousRightSwipeIndex];
                setMatchedProfile(previousRightSwipeProfile);
            }
        }

    }, [swipedRight, cards]);

    const handleContinue = () => {
        setMatchedProfile(null);
    };

    if (matchedProfile) {
        return (
            <MatchScreen 
                userName={"Nadějný chemik"} 
                profile={cards[0]} 
                onContinue={handleContinue} 
            />
        );
    }

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