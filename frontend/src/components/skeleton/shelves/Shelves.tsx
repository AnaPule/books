import type { Book as Bk } from "@models/Book";
import { useState, useMemo } from "react";
import styles from "./shelves.module.css";
import { useNavigate } from "react-router-dom";

interface ShelvesProps {
    shelf1: Bk[];
    shelf1Caption: string;
    shelf2?: Bk[] | null;
    shelf2Caption?: string;
    shelf3?: Bk[] | null;
    shelf3Caption?: string;
}

const SQ = 13;

// Soft cream, linen, sand, dusty blue-grey — sampled from reference images
const BOOK_COLORS = [
    { spine: '#c8bfb0', cover: '#d8d0c2', text: '#7a6e62' }, // warm linen
    { spine: '#b8b4a8', cover: '#ccc8bc', text: '#6a6560' }, // cool grey-linen
    { spine: '#d4c8b0', cover: '#e2d8c4', text: '#7a6e58' }, // warm sand
    { spine: '#c0bdb8', cover: '#d4d2cc', text: '#686460' }, // dusty grey
    { spine: '#cec4b2', cover: '#ddd4c0', text: '#74685a' }, // oat
    { spine: '#b8c0c4', cover: '#ccd4d8', text: '#5a6468' }, // dusty blue-grey
    { spine: '#d0c8bc', cover: '#e0d8cc', text: '#706860' }, // soft cream
    { spine: '#c4beb4', cover: '#d8d2c8', text: '#6c6660' }, // parchment
];

const GOLD = 'rgba(192,168,110,0.55)';

function seededRand(seed: number): number {
    const x = Math.sin(seed + 1) * 100000;
    return x - Math.floor(x);
}

function bookDims(idx: number) {
    // Vary depth more — some thin, some thick, like real books
    const d = 4 + Math.round(seededRand(idx));       // 8–16 (was always ~10-11)
    const h = 8 + Math.round(seededRand(idx + 50) * 3); // 10–13
    return { d, h };
}

function truncate(text: string, max: number) {
    return text.length <= max ? text : text.slice(0, max - 1) + '…';
}

function adjustColor(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00ff) + amt;
    const b = (num & 0x0000ff) + amt;
    return `#${(0x1000000 + (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
        (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x100 +
        (b < 255 ? (b < 1 ? 0 : b) : 255)).toString(16).slice(1)}`;
}

interface BookProps {
    book: Bk;
    slotIndex: number;
    colorIndex: number;
    isSelected: boolean;
    onSelect: () => void;
}

const Book: React.FC<BookProps> = ({ book, slotIndex, colorIndex, isSelected }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const { d, h } = useMemo(() => bookDims(colorIndex), [colorIndex]);
    const colors = BOOK_COLORS[colorIndex % BOOK_COLORS.length];
    const isTall = h > 12;

    const bookW = SQ * 2;
    const bookD = SQ * d;
    const bookH = SQ * (isTall ? h - 1 : h - 0.5);
    const xPos  = SQ * (1 + slotIndex * 2.1);

    const spineMaxChars = Math.floor((bookH - 16) / 7);
    const spineText = truncate(book.name, spineMaxChars);
    const rightMaxChars = Math.floor((bookD - 8) / 6);
    const rightText = truncate(book.name, rightMaxChars);

    const pageColor    = '#ffffff';
    const pageGradient = `linear-gradient(90deg,
        rgba(200,200,200,0.25) 0%,
        rgba(245,245,245,0.8) 50%,
        rgba(210,195,158,0.3) 100%)`;

    return (
        <div
            className={`${styles.block} ${isSelected ? styles.blockSelected : ''}`}
            style={{ transform: `translate3d(${xPos}px, ${-(d - 1) * SQ}px, ${(h + 8) * SQ}px)` }}
            onClick={() => navigate(`/book/${book.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            <div
                className={`${styles.blockInner} ${isSelected ? styles.blockInnerSelected : ''}`}
                style={{ width: bookW }}
            >
                {/* Bottom — aged paper */}
                <div style={{
                    top:'2px',
                    position: 'absolute', width: bookW, height: bookD,
                    background: pageGradient, backgroundColor: pageColor,
                    transformOrigin: 'top center',
                    transform: `rotateX(-90deg) translateY(-${(d - 1) * SQ}px)`,
                    borderRadius: '2px', opacity: 0.9,
                }} />

                {/* Top — aged paper */}
                <div style={{
                    top: '-2px',
                    position: 'absolute', width: bookW, height: bookD,
                    background: pageGradient, backgroundColor: pageColor,
                    transformOrigin: 'top center',
                    transform: `rotateX(-90deg) translateY(-${(d - 1) * SQ}px) translateZ(${bookH}px)`,
                    borderRadius: '2px', opacity: 0.95,
                }} />

                {/* FRONT FACE */}
                <div style={{
                    position: 'absolute', width: bookW, height: bookH,
                    background: `linear-gradient(180deg,
                        ${adjustColor(colors.cover, 5)} 0%,
                        ${colors.cover} 40%,
                        ${adjustColor(colors.cover, -6)} 100%)`,
                    transform: `translateZ(${(d - 1) * SQ}px)`,
                    borderRadius: '3px',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -1px 4px rgba(0,0,0,0.08)`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* Gold band top */}
                    <div style={{
                        position: 'absolute', top: 5, left: 1, right: 1,
                        height: 1.5, background: GOLD, borderRadius: '1px',
                    }} />
                    {/* Gold band bottom */}
                    <div style={{
                        position: 'absolute', bottom: 5, left: 1, right: 1,
                        height: 1.5, background: GOLD, borderRadius: '1px',
                    }} />
                    {/* Title vertical */}
                    <span style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontSize: 8,
                        fontWeight: 400,
                        letterSpacing: '0.18em',
                        color: colors.text,
                        opacity: 0.82,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: bookH - 24,
                        fontFamily: "'Georgia', serif",
                        position: 'relative', zIndex: 1,
                    }}>
                        {spineText}
                    </span>
                </div>

                {/* LEFT side */}
                <div style={{
                    position: 'absolute', width: bookD, height: bookH,
                    background: adjustColor(colors.spine, -8),
                    opacity: 0.9,
                    transformOrigin: 'center left',
                    transform: `rotateY(270deg) translateX(-${SQ}px)`,
                    borderRadius: '2px 0 0 2px',
                }} />

                {/* RIGHT side */}
                <div style={{
                    position: 'absolute', width: bookD, height: bookH,
                    background: `linear-gradient(180deg,
                        ${adjustColor(colors.spine, 4)} 0%,
                        ${colors.spine} 50%,
                        ${adjustColor(colors.spine, -4)} 100%)`,
                    transformOrigin: 'top right',
                    transform: `rotateY(-270deg) translate3d(${SQ}px, 0, ${SQ * (2 - d)}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0 2px 2px 0',
                    overflow: 'hidden',
                }}>
                    <span style={{
                        fontSize: 7,
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        color: colors.text,
                        opacity: 0.65,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: bookD - 8,
                        padding: '0 4px',
                        fontFamily: "'Georgia', serif",
                        writingMode: 'horizontal-tb',
                    }}>
                        {rightText}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ShelfSceneProps {
    books: Bk[];
    caption: string;
    seedOffset: number;
}

const ShelfScene: React.FC<ShelfSceneProps> = ({ books, caption, seedOffset }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const displayed = books.slice(0, 11);
    const surfaceW = SQ * 14;
    const surfaceH = SQ * 16;

    return (
        <div className={styles.shelfSection}>
            <span className={styles.caption}>{caption}</span>
            <div className={styles.sceneWrap}>
                <div className={styles.container}>
                    <div
                        className={styles.surface}
                        style={{
                            width: surfaceW,
                            height: surfaceH,
                            transform: `translateY(${SQ * 12.59}px) rotateX(86deg)`,
                        }}
                    >
                        {displayed.map((book, i) => (
                            <Book
                                key={i}
                                book={book}
                                slotIndex={i}
                                colorIndex={i + seedOffset}
                                isSelected={selected === i}
                                onSelect={() => setSelected(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.shelfBoard}>
                    <div className={styles.shelfGoldRail} />
                </div>
            </div>
        </div>
    );
};

export const Shelves: React.FC<ShelvesProps> = ({
    shelf1, shelf1Caption,
    shelf2 = null, shelf2Caption = "Next Up",
    shelf3 = null, shelf3Caption = "Finished",
}) => (
    <>
        <div className={styles.shelves}>
            <ShelfScene books={shelf1} caption={shelf1Caption} seedOffset={0} />
            {shelf2 && shelf2.length > 0 && (
                <ShelfScene books={shelf2} caption={shelf2Caption} seedOffset={11} />
            )}
            {shelf3 && shelf3.length > 0 && (
                <ShelfScene books={shelf3} caption={shelf3Caption} seedOffset={22} />
            )}
        </div>
    </>
);