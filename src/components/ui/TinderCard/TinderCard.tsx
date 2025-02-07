import React, { useState, useRef, ForwardedRef, act } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, BriefcaseBusiness, Heart, Quote, ThumbsDown } from "lucide-react";
import { TinderProfile } from "@/types";
import { cn } from "clsx-for-tailwind";
import ImageCarousel from "./ImageCarousel";
import ProfileInfo from "./ProfileInfo";

const SWIPE_THRESHOLD = 150; // Pixels to trigger swipe
const SCREEN_WIDTH = window.innerWidth;
const LIKE_COLOR_CLS = "bg-green-600";
const NOPE_COLOR_CLS = "bg-red-600";

interface TinderCardProps {
    profile: TinderProfile;
    onSwipe: (direction: string, profile: TinderProfile) => void;
}


type SwipeDirection = null | "left" | "right";

const SwipeOverlay = ({ visibility, colorClassName, className, children }) => {
    return (
        <div className={cn("absolute bg-opacity-20 top-0 left-0 w-full h-full", colorClassName)} style={{ opacity: visibility }}>
            <div className={cn("absolute top-8 border-2  p-2 rounded-full font-bold", colorClassName, className)}>
                {children}
            </div>
        </div>
    )
}


const TinderCard: React.FC<TinderCardProps> = ({ profile, onSwipe }) => {
    const [likeVisibility, setLikeVisibility] = useState(0);
    const [nopeVisibility, setNopeVisibility] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
    const [dragActive, setDragActive] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const [{ x, y, rotate, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        config: { tension: 300, friction: 20 },
    }));

    const animateSwipe = (swipeDirection: SwipeDirection, dx) => {
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
    // TODO: forward ref

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
            className={cn("absolute aspect-[2/3] max-h-[75vh] h-full rounded-3xl max-w-full bg-white shadow-lg", dragActive ? "z-50" : "z-0")}
        >
            <div className="h-full rounded-3xl relative overflow-hidden ">
                <ImageCarousel profile={profile} cardRef={cardRef} />

                <SwipeOverlay visibility={likeVisibility} colorClassName={LIKE_COLOR_CLS} className={`right-8`}>
                    LIKE
                </SwipeOverlay>

                <SwipeOverlay visibility={nopeVisibility} colorClassName={NOPE_COLOR_CLS} className={`left-8`}>
                    NOPE
                </SwipeOverlay>

                <div className="absolute inset-0 bg-gradient-to-b from-20% from-transparent via-transparent to-black to-95% top-0 pointer-events-none"></div>

                <ProfileInfo profile={profile} />
            </div>
            {/* (dis)like buttons */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 shadow-lg">
                    <ThumbsDown size={24} color="white" onClick={() => {
                        animateSwipe("left", -1);
                        onSwipe("left", profile);
                    }} />
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 shadow-lg">
                    <Heart size={24} color="white" onClick={() => {
                        animateSwipe("right", 1);
                        onSwipe("right", profile);
                    }} />
                </div>
            </div>
        </animated.div>
    );
};

export default TinderCard;