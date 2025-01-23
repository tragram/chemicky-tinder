import React, { useState, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Card, CardBody, CardFooter } from "@heroui/card";

import { BriefcaseBusiness } from "lucide-react";
import { px } from "framer-motion";

// const IconText()

const TinderCard = ({ item, onSwipe }) => {
    const [gone, setGone] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const cardRef = useRef(null);

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

            const trigger = velocity > 0.5;
            const swipeDirection = dx > 0 ? "right" : "left";

            if (trigger && !active) {
                setGone(true);
                onSwipe(swipeDirection, item);
            }

            api.start({
                x: gone ? dx * 200 : active ? mx : 0,
                y: gone ? my : active ? my : 0,
                rotate: active ? mx / 100 : 0,
                scale: active ? 1.1 : 1,
            });
        },
        { filterTaps: true }
    );

    const handleTap = (e) => {
        const { clientX } = e;
        const rect = cardRef.current.getBoundingClientRect();
        const tapPosition = clientX - rect.left;
        const width = rect.width;

        if (tapPosition < width / 2) {
            setCurrentImage(prev => Math.max(prev - 1, 0));
        } else {
            setCurrentImage(prev => Math.min(prev + 1, item.images.length - 1));
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
            className="absolute w-[600px] h-[800px] bg-white shadow-lg rounded-lg overflow-hidden"
        >
            <Card className="h-[600px] rounded-none" isFooterBlurred >
                <CardBody className="p-0">
                    {/* Image indicators */}
                    <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {item.images.map((_, index) => (
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
                        className="relative w-full h-full overflow-hidden"
                    >
                        <div
                            className="flex w-full h-full"
                            style={{
                                transform: `translateX(${-currentImage * 100}%)`,
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {item.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-full h-full"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </CardBody>

                {/* Info overlay */}
                <div className="absolute bottom-0 p-8 w-full text-[white] z-10 ">
                    <div className="flex flex-grow flex-col w-full p-4 border-[#f04e23] border-2 backdrop-blur-sm rounded-lg bg-[#f04e23]/20">
                        <h2 className="text-2xl font-bold">{item.name}</h2>
                        <p className="text-small font-bold">{item.age} let</p>
                        <div className="flex gap-1 text-small font-bold items-center"><BriefcaseBusiness size={16}/>{item.job}</div>
                    </div>
                </div>
            </Card>
            <div className="p-4">
                <p>
                    {item.description}
                </p>
            </div>
        </animated.div>
    );
};

export default TinderCard;