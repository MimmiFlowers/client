import { DECORATION_CONTENT } from "./wreathGeometry";

/**
 * Decoration art covers only the middle of its 350 px canvas (that padding keeps
 * the stage true to scale), so thumbnails zoom past it: the visible decoration
 * fills ~90% of the box. Not clipped, so slightly larger art may overhang a little.
 */
const THUMB_ZOOM = 0.9 / DECORATION_CONTENT;

interface Props {
    src: string;
    /** Size and position of the box, e.g. "h-13 w-13". */
    className?: string;
}

const DecorationThumb = ({ src, className = "" }: Props) => (
    <span className={`block ${className}`} aria-hidden="true">
        <img
            src={src}
            alt=""
            draggable={false}
            className="h-full w-full object-contain"
            style={{ transform: `scale(${THUMB_ZOOM})` }}
        />
    </span>
);

export default DecorationThumb;
