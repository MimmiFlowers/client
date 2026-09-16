import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
    children: ReactNode;
    as?: ElementType;
    delay?: number;
    className?: string;
};

/** Fades content up once when it first scrolls into view. */
const Reveal = ({
    children,
    as: Tag = "div",
    delay = 0,
    className = "",
}: RevealProps) => {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "is-visible" : ""} ${className}`}
            style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
