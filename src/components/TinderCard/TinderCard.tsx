import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";
import ImageCarousel from "./ImageCarousel";
import ProfileInfo from "./ProfileInfo";

const SWIPE_THRESHOLD = 150;
const SCREEN_WIDTH = window.innerWidth;
const LIKE_COLOR_CLS = "bg-green-600";
const NOPE_COLOR_CLS = "bg-red-600";

interface TinderCardProps {
    profile: TinderProfile;
    active: boolean;
    zIndex: number;
    onSwipe: (direction: string, profile: TinderProfile) => void;
}

type SwipeDirection = null | "left" | "right";

const SwipeOverlay = ({ visibility, colorClassName, className, children }) => {
    return (
        <div className={cn("absolute pointer-events-none bg-opacity-20 top-0 left-0 w-full h-full", colorClassName)} style={{ opacity: visibility }}>
            <div className={cn("absolute top-8 border-2  p-2 rounded-full font-bold", colorClassName, className)}>
                {children}
            </div>
        </div>
    )
}

const TinderCard: React.FC<TinderCardProps> = ({ profile, zIndex, active, onSwipe }) => {
    const [likeVisibility, setLikeVisibility] = useState(0);
    const [nopeVisibility, setNopeVisibility] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
    const [dragActive, setDragActive] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const [{ x, y, rotate, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotate: 0,
        scale: active ? 1 : 0.9,
        config: { tension: 300, friction: 20 },
    }));

    // Add a spring for the active state transition
    const [{ activeScale }, activeApi] = useSpring(() => ({
        activeScale: active ? 1 : 0.9,
        config: { tension: 300, friction: 20 },
    }));

    // Update the scale when active state changes
    React.useEffect(() => {
        activeApi.start({
            activeScale: active ? 1 : 0.9,
        });
    }, [active, activeApi]);

    const animateSwipe = (swipeDirection: SwipeDirection, dx) => {
        const outX = swipeDirection === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
        api.start({
            x: outX,
            rotate: dx * 0.1,
            scale: 0.8,
        });
    }

    const bindCard = useDrag(
        ({ active, movement: [mx, my], direction: [dx], velocity, tap }) => {
            if (tap) return;
            setDragActive(active);
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
                setTimeout(() => {
                    onSwipe(swipeDirection, profile);
                }, 300);
            } else {
                if (!active) {
                    setNopeVisibility(0);
                    setLikeVisibility(0);
                    setSwipeDirection(null);
                }
                api.start({
                    x: active ? mx : 0,
                    y: active ? my : 0,
                    rotate: active ? mx * 0.1 : 0,
                    scale: active ? 1.1 : activeScale.get(),
                });
            }
        },
        { filterTaps: true, eventOptions: { capture: true } }
    );

    return (
        <animated.div
            ref={cardRef}
            {...bindCard()}
            style={{
                x,
                y,
                rotate,
                scale: activeScale.to(s => s * scale.get()),
                touchAction: "none",
                zIndex: dragActive ? 50 : zIndex,
            }}
            className="absolute aspect-[2/3] h-[90%] max-w-[95%] rounded-3xl"
        >
            <div className={cn("h-full w-full transition-all rounded-3xl relative overflow-hidden bg-white", active ? "" : "blur-sm")}>
                <ImageCarousel profile={profile} cardRef={cardRef} />

                <SwipeOverlay visibility={likeVisibility} colorClassName={LIKE_COLOR_CLS} className="right-8">
                    LIKE
                </SwipeOverlay>

                <SwipeOverlay visibility={nopeVisibility} colorClassName={NOPE_COLOR_CLS} className="left-8">
                    NOPE
                </SwipeOverlay>

                <div className="absolute pointer-events-none inset-0 bg-gradient-to-b from-20% from-transparent via-transparent to-black to-95% top-0" />

                <ProfileInfo profile={profile} />
            </div>

            <div className="absolute -bottom-6 short:-bottom-5 left-0 right-0 flex justify-center gap-4 z-10">
                <div className={cn("flex items-center justify-center w-12 h-12 short:h-10 short:w-10 rounded-full", NOPE_COLOR_CLS, active ? "opacity-100" : "opacity-0")}>
                    <ThumbsDown 
                        size={24} 
                        color="white" 
                        onClick={() => {
                            animateSwipe("left", -1);
                            onSwipe("left", profile);
                        }} 
                    />
                </div>
                <div className={cn("flex items-center justify-center w-12 h-12 short:h-10 short:w-10 rounded-full", LIKE_COLOR_CLS, active ? "opacity-100" : "opacity-0")}>
                    <Heart 
                        size={24} 
                        color="white" 
                        onClick={() => {
                            animateSwipe("right", 1);
                            onSwipe("right", profile);
                        }} 
                    />
                </div>
            </div>
        </animated.div>
    );
};

export default TinderCard;