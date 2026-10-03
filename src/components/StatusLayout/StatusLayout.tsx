import type { ReactNode } from "react";

type Props = {
    visual: ReactNode;
    /** Short line set under the title. */
    note?: ReactNode;
    title: ReactNode;
    children?: ReactNode;
    actions?: ReactNode;
};

/** Centred layout for confirmation, cancellation and error pages. */
const StatusLayout = ({ visual, note, title, children, actions }: Props) => (
    <div className="container-luxe flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
        <div className="animate-rise">{visual}</div>
        <h1
            className="mt-8 max-w-2xl animate-rise font-display text-[2.6rem] leading-[1] font-medium tracking-[-0.025em] sm:text-6xl"
            style={{ animationDelay: "140ms" }}
        >
            {title}
        </h1>
        {note && (
            <p
                className="mt-3 animate-rise font-display text-item-title text-accent-ink"
                style={{ animationDelay: "170ms" }}
            >
                {note}
            </p>
        )}
        {children && (
            <div
                className="mt-6 max-w-md animate-rise space-y-2 text-body-sm leading-relaxed text-ink-soft"
                style={{ animationDelay: "200ms" }}
            >
                {children}
            </div>
        )}
        {actions && (
            <div
                className="mt-10 flex animate-rise flex-col items-center gap-4"
                style={{ animationDelay: "260ms" }}
            >
                {actions}
            </div>
        )}
    </div>
);

export default StatusLayout;
