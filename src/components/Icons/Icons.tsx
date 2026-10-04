import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* One hairline icon family: 24px grid, 1.25 stroke, currentColor. */
const Base = ({ children, className = "h-5 w-5", ...props }: IconProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        {children}
    </svg>
);

export const BagIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M5.5 8.5h13l-1 11.25a1.5 1.5 0 0 1-1.5 1.25H8a1.5 1.5 0 0 1-1.5-1.25z" />
        <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </Base>
);

export const MenuIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M3.5 8h17M3.5 16h11" />
    </Base>
);

export const CloseIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M6 6l12 12M18 6L6 18" />
    </Base>
);

export const ArrowRightIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M4 12h15.5M14 6.5l5.5 5.5-5.5 5.5" />
    </Base>
);

export const ArrowLeftIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M20 12H4.5M10 6.5 4.5 12l5.5 5.5" />
    </Base>
);

export const ArrowUpRightIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M7 17 17 7M8.5 7H17v8.5" />
    </Base>
);

export const PlusIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M12 5v14M5 12h14" />
    </Base>
);

export const MinusIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M5 12h14" />
    </Base>
);

export const CheckIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
);

export const TrashIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M4.5 7h15M9.5 7V4.75h5V7M6.5 7l1 12.25a1.5 1.5 0 0 0 1.5 1.25h6a1.5 1.5 0 0 0 1.5-1.25L17.5 7" />
    </Base>
);

export const ChevronDownIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="m6 9.5 6 6 6-6" />
    </Base>
);

export const FiltersIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
        <circle cx="15" cy="7" r="2" />
        <circle cx="9" cy="17" r="2" />
    </Base>
);

export const TruckIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M2.75 6.5h11v9.5h-11zM13.75 10h4l3.5 3.5V16h-7.5" />
        <circle cx="7" cy="17.5" r="1.75" />
        <circle cx="17.5" cy="17.5" r="1.75" />
    </Base>
);

export const GiftIcon = (props: IconProps) => (
    <Base {...props}>
        <rect x="3.5" y="8.5" width="17" height="4" rx="0.75" />
        <path d="M5 12.5v7.25a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 .75-.75V12.5M12 8.5v12" />
        <path d="M12 8.5C10.5 5 7 4.5 7 6.75S10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.75S14 8.5 12 8.5z" />
    </Base>
);

export const HandIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M12 21c-4.5 0-7.5-3-7.5-7v-3a1.5 1.5 0 0 1 3 0v1.5M7.5 12V5.5a1.5 1.5 0 0 1 3 0V11M10.5 11V4a1.5 1.5 0 0 1 3 0v7M13.5 11V5.5a1.5 1.5 0 0 1 3 0V13c0 2-.5 3.5-1.5 5" />
        <path d="M16.5 9.5a1.5 1.5 0 0 1 3 0V14c0 4-3 7-7.5 7" />
    </Base>
);

export const MailIcon = (props: IconProps) => (
    <Base {...props}>
        <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
        <path d="m3.5 7 8.5 6 8.5-6" />
    </Base>
);

export const PhoneIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M5 3.5h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5A1.5 1.5 0 0 1 5 3.5z" />
    </Base>
);

export const ClockIcon = (props: IconProps) => (
    <Base {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
    </Base>
);

export const PinIcon = (props: IconProps) => (
    <Base {...props}>
        <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.25" />
    </Base>
);

export const LockIcon = (props: IconProps) => (
    <Base {...props}>
        <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
        <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    </Base>
);

export const AlertIcon = (props: IconProps) => (
    <Base {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.75v5M12 16.25v.01" />
    </Base>
);

/* Brand glyphs are filled marks, not outline icons. */
export const InstagramIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
    </svg>
);

export const TikTokIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.18z" />
    </svg>
);

/** Decorative line drawing for empty states. */
export const FlowerOutline = ({ className = "h-16 w-16" }: { className?: string }) => (
    <svg
        className={`${className} text-line-strong`}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
        focusable="false"
    >
        <circle cx="32" cy="22" r="4" />
        <path d="M32 18c-2-6 0-12 0-12s2 6 0 12M36 22c6-2 12 0 12 0s-6 2-12 0M32 26c2 6 0 12 0 12s-2-6 0-12M28 22c-6 2-12 0-12 0s6-2 12 0" />
        <path d="M32 38v22M32 50c-4-6-10-7-14-6 2 5 8 7 14 6M32 46c4-6 10-7 14-6-2 5-8 7-14 6" />
    </svg>
);
