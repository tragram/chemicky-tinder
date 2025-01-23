import React, { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Card, CardBody } from "@heroui/card";
import { BriefcaseBusiness } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

const SWIPE_THRESHOLD = 150; // Pixels to trigger swipe
const SCREEN_WIDTH = window.innerWidth;

interface TinderCardProps {
    profile: TinderProfile;
    onSwipe: (direction: string, profile: TinderProfile) => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ profile, onSwipe }) => {
    const [likeVisibility, setLikeVisibility] = useState(0);
    const [nopeVisibility, setNopeVisibility] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    const [{ x, y, rotate, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        config: { tension: 300, friction: 20 },
    }));

    const bindCard = useDrag(
        ({ active, movement: [mx, my], direction: [dx], velocity, tap }) => {
            if (tap) return;

            const swipeDirection = mx > 0 ? "right" : "left";
            setSwipeDirection(swipeDirection);
            const absMx = Math.abs(mx);
            const tagOpacity = absMx / SWIPE_THRESHOLD;
            if (swipeDirection == "right") {
                setLikeVisibility(tagOpacity);
                setNopeVisibility(0);
            } else {
                setLikeVisibility(0);
                setNopeVisibility(tagOpacity);

            }

            if (!active && absMx > SWIPE_THRESHOLD) {
                // Swipe out of screen
                const outX = swipeDirection === "right"
                    ? SCREEN_WIDTH
                    : -SCREEN_WIDTH;

                api.start({
                    x: outX,
                    rotate: dx * 0.1,
                    scale: 0.8,
                });

                // Delay to allow animation before callback
                setTimeout(() => {
                    onSwipe(swipeDirection, profile);
                }, 300);
            } else {
                if (!active) {
                    //stopped dragging too soon
                    setNopeVisibility(0);
                    setLikeVisibility(0);
                    setSwipeDirection(null);
                }
                // Normal dragging
                api.start({
                    x: active ? mx : 0,
                    y: active ? my : 0,
                    rotate: active ? mx * 0.1 : 0,
                    scale: active ? 1.1 : 1,
                });
            }
        },
        { filterTaps: true, eventOptions: { capture: true } }
    );

    const handleTap = (e) => {
        const { clientX } = e;
        const rect = cardRef.current?.getBoundingClientRect();
        const tapPosition = clientX - rect.left;
        const width = rect.width;

        if (tapPosition < width / 2) {
            setCurrentImage(prev => Math.max(prev - 1, 0));
        } else {
            setCurrentImage(prev => Math.min(prev + 1, profile.images.length - 1));
        }
    };

    return (
        <animated.div
            ref={cardRef}
            {...bindCard()}
            style={{
                x,
                y,
                rotate,
                scale,
                touchAction: "none",
            }}
            className="absolute aspect-[2/3] max-h-[600px] h-full max-w-full bg-white shadow-lg rounded-lg overflow-hidden z-0"
        >
            <div className="h-full rounded-none relative">
                {/* Image indicators */}
                <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {profile.images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-[35px] h-1.5 rounded backdrop-blur-md ${currentImage === index
                                ? 'bg-white bg-opacity-90'
                                : 'bg-white bg-opacity-50'
                                }`}
                        />
                    ))}
                </div>

                {/* Image carousel */}
                <div
                    onClick={handleTap}
                    className="relative w-full h-full overflow-hidden z-0"
                >
                    <div
                        className="flex w-full h-full"
                        style={{
                            transform: `translateX(${-currentImage * 100}%)`,
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        {profile.images.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full h-full relative"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className={cn("absolute inset-0  bg-opacity-20", swipeDirection === "right" ? "bg-green-600" : "bg-red-600")} style={{ opacity: Math.max(nopeVisibility,likeVisibility)-0.5 }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-8 left-8 border-2 border-green-600 text-green-600 p-2 rounded-full font-bold" style={{ opacity: likeVisibility }}>LIKE</div>
                <div className="absolute top-8 right-8 border-2 border-red-600 text-red-600 p-2 rounded-full font-bold" style={{ opacity: nopeVisibility }}>NOPE</div>

                {/* Info overlay */}
                <div className="absolute bottom-0 p-8 w-full text-[white]">
                    <div className="flex flex-grow flex-col w-full p-4 border-[#f04e23] border-2 backdrop-blur-sm rounded-lg bg-[#f04e23]/20">
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-small font-bold">{profile.age} let</p>
                        <div className="flex gap-1 text-small font-bold items-center">
                            <BriefcaseBusiness size={16} />{profile.job}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <p>{profile.description}</p>
            </div>
        </animated.div>
    );
};

export default TinderCard;