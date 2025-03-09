import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './AnimatedBackground.scss';

const AnimatedBackground = ({ children }) => {
    // Track mouse position, starting at 0
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Shape 1 (fast responsive shape)
    const shape1X = useSpring(mouseX, { damping: 50, stiffness: 90 });
    const shape1Y = useSpring(mouseY, { damping: 50, stiffness: 90 });

    // Shape 2 (medium response)
    const shape2X = useSpring(mouseX, { damping: 30, stiffness: 90 });
    const shape2Y = useSpring(mouseY, { damping: 30, stiffness: 90 });

    // Shape 3 (slow response)
    const shape3X = useSpring(mouseX, { damping: 35, stiffness: 90 });
    const shape3Y = useSpring(mouseY, { damping: 35, stiffness: 90 });

    // Track mouse movement with useEffect
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Convert mouse position to values between -1 and 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            
            // Scale the movement range, increase this number for more dramatic movement
            mouseX.set(x * 30);
            mouseY.set(y * 30);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <Box className="animated_background">
            <Box className="animated_background-content">
                {children}
            </Box>
            <motion.svg 
                style={{ x: shape1X, y: shape1Y }}
                className="animated_background-svg_1" 
                width="395" 
                height="454" 
                viewBox="0 0 395 454" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path id="shape_1" d="M394.5 197.5C394.5 224.651 384.421 254.198 367.563 283.266C350.707 312.329 327.091 340.883 300.063 366.038C245.985 416.369 178.352 453 124 453C96.8559 453 75.5928 443.864 58.9479 428.472C42.2916 413.069 30.2362 391.378 21.5691 366.241C4.23253 315.959 0.5 252.03 0.5 197.5C0.5 88.6999 88.6999 0.5 197.5 0.5C306.3 0.5 394.5 88.6999 394.5 197.5Z"/>
            </motion.svg>
            <motion.svg 
                style={{ x: shape2X, y: shape2Y }}
                className="animated_background-svg_2" 
                width="677" 
                height="511" 
                viewBox="0 0 677 511" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M676.5 33.6412C676.5 60.794 662.829 104.155 640.554 153.985C618.291 203.79 587.467 259.984 553.234 312.773C519 365.564 481.367 414.932 445.49 451.097C427.551 469.179 410.062 483.949 393.667 494.195C377.265 504.445 362.001 510.141 348.5 510.141C341.516 510.141 334 510.176 326.048 510.213C271.872 510.466 197.465 510.814 133.424 500.801C96.7004 495.059 63.4396 485.917 39.372 471.432C15.3229 456.958 0.499932 437.184 0.499932 410.141C0.499932 383.035 15.3854 351.102 39.5165 318.406C63.6357 285.726 96.9403 252.351 133.663 222.375C170.384 192.399 210.508 165.834 248.256 146.764C286.018 127.688 321.349 116.141 348.5 116.141C375.886 116.141 410.138 104.156 446.05 87.9456C470.141 77.0713 495.026 64.2727 519.128 51.8772C530.962 45.7908 542.607 39.8017 553.877 34.1851C588.138 17.1099 618.895 3.49658 641.068 0.933854C652.149 -0.34682 660.978 1.14577 667.037 6.23081C673.089 11.3099 676.5 20.078 676.5 33.6412Z"/>
            </motion.svg>
            <motion.svg 
                style={{ x: shape3X, y: shape3Y }}
                className="animated_background-svg_3" 
                width="677" 
                height="511" 
                viewBox="0 0 677 511" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M676.5 33.6412C676.5 60.794 662.829 104.155 640.554 153.985C618.291 203.79 587.467 259.984 553.234 312.773C519 365.564 481.367 414.932 445.49 451.097C427.551 469.179 410.062 483.949 393.667 494.195C377.265 504.445 362.001 510.141 348.5 510.141C341.516 510.141 334 510.176 326.048 510.213C271.872 510.466 197.465 510.814 133.424 500.801C96.7004 495.059 63.4396 485.917 39.372 471.432C15.3229 456.958 0.499932 437.184 0.499932 410.141C0.499932 383.035 15.3854 351.102 39.5165 318.406C63.6357 285.726 96.9403 252.351 133.663 222.375C170.384 192.399 210.508 165.834 248.256 146.764C286.018 127.688 321.349 116.141 348.5 116.141C375.886 116.141 410.138 104.156 446.05 87.9456C470.141 77.0713 495.026 64.2727 519.128 51.8772C530.962 45.7908 542.607 39.8017 553.877 34.1851C588.138 17.1099 618.895 3.49658 641.068 0.933854C652.149 -0.34682 660.978 1.14577 667.037 6.23081C673.089 11.3099 676.5 20.078 676.5 33.6412Z"/>
            </motion.svg>
        </Box>
    );
};

export default AnimatedBackground;
