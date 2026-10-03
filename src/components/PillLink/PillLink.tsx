import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRightIcon } from "../Icons/Icons";

/**
 * The site's primary call to action: a pill with the label on the left and
 * a lilac arrow disc on the right (same shape as the cart's checkout button).
 * `dark` sits on light surfaces, `light` on photos and dark bands.
 */
const TONES = {
    dark: "bg-ink text-blush hover:bg-ink-soft",
    light: "bg-blush text-ink",
} as const;

type Props = {
    to: string;
    children: ReactNode;
    tone?: keyof typeof TONES;
    /** Extra classes, e.g. margins or the carousel's slide-in transition. */
    className?: string;
    onClick?: () => void;
};

const PillLink = ({ to, children, tone = "dark", className = "", onClick }: Props) => (
    <Link
        to={to}
        onClick={onClick}
        className={`group inline-flex h-14 items-center gap-5 rounded-full pr-2 pl-7 text-button font-medium tracking-[0.18em] uppercase transition-[background-color,transform] duration-300 active:scale-[0.98] ${TONES[tone]} ${className}`}
    >
        {children}
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
            <ArrowRightIcon className="h-4 w-4" />
        </span>
    </Link>
);

export default PillLink;
