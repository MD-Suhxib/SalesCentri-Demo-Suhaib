/*
	Vertical Dock Component for Chat Mode
*/

"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type VerticalDockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  "data-track"?: string;
};

export type VerticalDockProps = {
  items: VerticalDockItemData[];
  className?: string;
  distance?: number;
  panelWidth?: number;
  baseItemSize?: number;
  dockWidth?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type VerticalDockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  "data-track"?: string;
  mouseX: MotionValue;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function VerticalDockItem({
  children,
  className = "",
  onClick,
  "data-track": dataTrack,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: VerticalDockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-black/20 backdrop-blur-xl border-white/10 border-2 shadow-lg cursor-pointer ${className}`}
      data-track={dataTrack}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        React.isValidElement(child) && child.type === VerticalDockLabel
          ? cloneElement(child as React.ReactElement<VerticalDockLabelProps>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

type VerticalDockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function VerticalDockLabel({ children, className = "", isHovered }: VerticalDockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: -10 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -left-2 top-1/2 w-fit whitespace-pre rounded-md border border-white/20 bg-black/40 backdrop-blur-xl px-2 py-0.5 text-xs text-white shadow-lg pointer-events-none`}
          role="tooltip"
          style={{ 
            y: "-50%",
            transform: "translateX(-100%) translateY(-50%)"
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type VerticalDockIconProps = {
  className?: string;
  children: React.ReactNode;
};

function VerticalDockIcon({ children, className = "" }: VerticalDockIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function VerticalDock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 100,
  panelWidth = 64,
  dockWidth = 256,
  baseItemSize = 50,
}: VerticalDockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockWidth, magnification + magnification / 2 + 4),
    [magnification, dockWidth],
  );
  const heightCol = useTransform(isHovered, [0, 1], [panelWidth, maxHeight]);
  const height = useSpring(heightCol, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} flex flex-col items-center h-fit gap-4 rounded-2xl border-white/5 border-2 py-4 px-2 bg-black/10 backdrop-blur-xl shadow-2xl`}
        style={{ width: panelWidth }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <VerticalDockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            data-track={item["data-track"]}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <VerticalDockIcon>{item.icon}</VerticalDockIcon>
            <VerticalDockLabel>{item.label}</VerticalDockLabel>
          </VerticalDockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
