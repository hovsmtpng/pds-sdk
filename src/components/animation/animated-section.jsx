import { motion, AnimatePresence } from "framer-motion";

export const AnimatedSection = ({
    children,
    visible = true,
    duration = 0.35,
    delay = 0,
    animation = "fade-up", // fade-up | slide-left | zoom
    className = "",
}) => {
    const variants = {
        "fade-up": {
            initial: { opacity: 0, y: 20, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 20, scale: 0.97 },
        },
        "slide-left": {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 30 },
        },
        "zoom": {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
        },
    };

    const selected = variants[animation];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="animated-section"
                    initial={selected.initial}
                    animate={selected.animate}
                    exit={selected.exit}
                    transition={{
                        duration,
                        delay,
                        ease: "easeInOut",
                    }}
                    className={className}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
