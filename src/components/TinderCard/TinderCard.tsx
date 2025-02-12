import React, { useState, useRef, ForwardedRef, act, useEffect } from "react";
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
    cardActive: boolean;
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

const TinderCard: React.FC<TinderCardProps> = ({ profile, zIndex, cardActive, onSwipe }) => {
    const [likeVisibility, setLikeVisibility] = useState(0);
    const [nopeVisibility, setNopeVisibility] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
    const [dragActive, setDragActive] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const [{ x, y, rotate, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.8,
        config: { tension: 300, friction: 15 },
    }));

    useEffect(() => {
        if (cardActive) { api.start({ scale: 1 }) }
    }, [cardActive])

    const animateSwipe = (swipeDirection: SwipeDirection, dx) => {
        const outX = swipeDirection === "right" ? 2 * SCREEN_WIDTH : -2 * SCREEN_WIDTH;
        api.start({
            x: outX,
            rotate: dx * 0.1,
            scale: 0.8,
        });
    }

    const bindCard = useDrag(
        ({ active, movement: [mx, my], direction: [dx], tap }) => {
            if (tap) return;
            console.log(active)
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
                }, 100);
            } else {
                if (!active) {
                    setNopeVisibility(0);
                    setLikeVisibility(0);
                    setSwipeDirection(null);
                }
                api.start({
                    x: active ? mx : 0,
                    y: active ? my : 0,
                    // scale: active ? 1.1 : 1,
                    rotate: active ? mx * 0.1 : 0,
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
                scale: scale,
                touchAction: "none",
                zIndex: zIndex,
            }}
            className={cn("absolute aspect-[2/3] h-[90%] max-w-[95%] rounded-3xl", cardActive ? "" : "pointer-events-none")}
        >
            <div className={cn("h-full w-full transition-transform rounded-3xl relative overflow-clip bg-white", cardActive ? "" : "blur-sm")}>
                <ImageCarousel profile={profile} cardRef={cardRef} />

                <SwipeOverlay visibility={likeVisibility} colorClassName={LIKE_COLOR_CLS} className="right-8">
                    LIKE
                </SwipeOverlay>

                <SwipeOverlay visibility={nopeVisibility} colorClassName={NOPE_COLOR_CLS} className="left-8">
                    NOPE
                </SwipeOverlay>

                <div className="absolute flex items-end top-0 overflow-y-scroll w-full h-full pointer-events-none">
                    <ProfileInfo profile={profile} className="max-h-[60%]" />
                </div>
            </div>

            <div className="absolute -bottom-6 short:-bottom-5 left-0 right-0 flex justify-center gap-4 z-20">
                <div className={cn("flex items-center justify-center w-12 h-12 short:h-10 short:w-10 rounded-full", NOPE_COLOR_CLS, cardActive ? "opacity-100" : "opacity-0")}>
                    <ThumbsDown
                        size={24}
                        color="white"
                        onClick={() => {
                            animateSwipe("left", -1);
                            onSwipe("left", profile);
                        }}
                    />
                </div>
                <div className={cn("flex items-center justify-center w-12 h-12 short:h-10 short:w-10 rounded-full", LIKE_COLOR_CLS, cardActive ? "opacity-100" : "opacity-0")}>
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