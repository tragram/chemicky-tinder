import React, { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";

const SWIPE_THRESHOLD = 150; // Pixels to trigger swipe
const SCREEN_WIDTH = window.innerWidth;
const VSCHT_RED = "#f04e23"
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

    const animateSwipe = (swipeDirection, dx) => {
        // Swipe out of screen
        const outX = swipeDirection === "right"
            ? SCREEN_WIDTH
            : -SCREEN_WIDTH;

        api.start({
            x: outX,
            rotate: dx * 0.1,
            scale: 0.8,
        });

    }

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
                animateSwipe(swipeDirection, dx);

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
            className="absolute aspect-[2/3] max-h-[600px] h-full rounded-3xl max-w-full bg-white shadow-lg z-0"
        >
            <div className="h-full rounded-3xl relative overflow-hidden ">
                {/* Image indicators */}
                <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {profile.images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-[35px] h-1.5 rounded backdrop-blur-md ${currentImage === index
                                ? `bg-[${VSCHT_RED}] bg-opacity-90`
                                : `bg-[white] bg-opacity-50`
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
                                <div className={cn("absolute inset-0  bg-opacity-20", swipeDirection === "right" ? "bg-green-600" : "bg-red-600")} style={{ opacity: Math.max(nopeVisibility, likeVisibility) - 0.5 }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-8 left-8 border-2 border-green-600 text-green-600 p-2 rounded-full font-bold" style={{ opacity: likeVisibility }}>LIKE</div>
                <div className="absolute top-8 right-8 border-2 border-red-600 text-red-600 p-2 rounded-full font-bold" style={{ opacity: nopeVisibility }}>NOPE</div>

                {/* Info overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-20% from-transparent via-transparent to-black to-95% top-0 pointer-events-none"></div>

                <div className="absolute flex flex-col bottom-0 p-8 w-full text-[white] gap-2">
                    <div className="flex flex-row items-bottom gap-4">
                        <h2 className={cn("text-2xl font-bold", `text-[white]`)} >{profile.name}</h2>
                        <p className={cn("text-2xl font-normal", `text-[${VSCHT_RED}]`)}>{profile.age}</p>
                    </div>

                    <div className="flex gap-1 text-md font-bold items-center">
                        <BriefcaseBusiness size={16} color={VSCHT_RED} />{profile.job}
                    </div>

                    <div className="flex gap-1 text-sm font-semibold items-start">
                        <div><Quote size={16} color={VSCHT_RED} /></div>
                        <p>{profile.description}</p>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 shadow-lg">
                    <ArrowLeft size={24} color="black" onClick={() => onSwipe("back", profile)} />
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 shadow-lg">
                    <ThumbsDown size={24} color="white" onClick={() => {
                        animateSwipe("left", -1);
                    }} />
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 shadow-lg">
                    <Heart size={24} color="white" onClick={() => {
                        animateSwipe("right", 1);
                    }} />
                </div>
            </div>
        </animated.div>
    );
};

export default TinderCard;