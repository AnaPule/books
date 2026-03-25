import type { Book as Bk } from "@models/Book";
import styles from "./shelves.module.css";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Tooltip from "@components/skeleton/ToolTip";
interface ShelvesProps {
    shelf1: Bk[] | null;
    shelf1Caption: string;
    shelf1SeeAll?: () => void;

    shelf2?: Bk[] | null;
    shelf2Caption?: string;
    shelf2SeeAll?: () => void;

    shelf3?: Bk[] | null;
    shelf3Caption?: string;
    shelf3SeeAll?: () => void;

    shelf4?: Bk[] | null;
    shelf4Caption?: string;
    shelf4SeeAll?: () => void;

    shelf5?: Bk[] | null;
    shelf5Caption?: string;
    shelf5SeeAll?: () => void;
}

interface BookProps {
    books: Bk[];
}

interface SingleBookShelfProps {
    book: Bk;
    rank?: number;
}

interface TopThreeShelvesProps {
    books: Bk[];
}

const randomColour = () => {
    const covers = [
        'https://i.pinimg.com/736x/1c/5a/f9/1c5af9ef684d12f67e679022b6c9e7c3.jpg',
        'https://i.pinimg.com/1200x/06/b8/6d/06b86da97b7c0358944941a1d536ae5f.jpg',
        'https://i.pinimg.com/736x/9e/86/04/9e8604207b5dceca484d00ae011f2250.jpg',
        'https://i.pinimg.com/736x/68/a2/48/68a248e7e17174e28e6a2bca70b63ff0.jpg'
    ];

    return covers[Math.floor(Math.random() * covers.length)];
}

const SingleBookShelf: React.FC<SingleBookShelfProps> = ({ book, rank }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full mb-[clamp(0.5rem,2vh,1rem)] md:mt-[clamp(1rem,4vh,2rem)]">
            {/* Book + rank container */}
            <div
                className="
                    flex items-end gap-2 lg:gap-0 sm:gap-3 md:gap-4 
                    pl-3 sm:pl-4 md:pl-6 
                    pb-[2px] 
                    cursor-pointer
                "
                onClick={() => navigate(`/book/${book.id}`)}
            >
                {/* Rank number */}
                {rank && (
                    <span className="
                        font-serif text-[clamp(1.2rem,4vw,2.5rem)] 
                        font-bold text-[#C9B27C] opacity-50 
                        leading-none mb-1 min-w-[clamp(1.2rem,4vw,2rem)]
                        select-none
                    ">
                        {rank}
                    </span>
                )}

                {/* 3D Book */}
                <div className="
                    relative 
                    w-[clamp(45px,12vw,70px)] h-[clamp(65px,18vw,100px)]
                    transform-style-preserve-3d
                    transition-transform duration-300 ease-out
                    drop-shadow-[4px_6px_10px_rgba(0,0,0,0.25)]
                    mx-0 mb-[-10px] md ml-0 :ml-[clamp(0px,3vw,30px)]
                    mr-3
                    z-10 shrink-0
                    hover:translate-y-[-4px] hover:rotate-y-[-10deg]
                "
                    style={{
                        transform: 'perspective(400px) rotateY(-18deg)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'perspective(400px) rotateY(-10deg) translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'perspective(400px) rotateY(-18deg)')}
                >
                    {/* Spine — left dark strip */}
                    <div className="
                        absolute left-0 top-0 
                        w-[clamp(5px,1.5vw,10px)] h-full 
                        bg-[#3D2E1A] rounded-l-[2px]
                        origin-left
                        bg-gradient-to-r from-[#2a1f10] to-[#3D2E1A]
                    " style={{ transform: 'rotateY(90deg)' }} />

                    {/* Cover face */}
                    <div className="
                        absolute inset-0 
                        rounded-[2px_3px_3px_2px]
                        bg-cover bg-center
                        shadow-[inset_-3px_0_6px_rgba(0,0,0,0.2),inset_3px_0_4px_rgba(255,255,255,0.08)]
                        overflow-hidden
                    " style={{
                            backgroundImage: book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`,
                            backgroundColor: book.coverArt ? 'transparent' : '#6B5E4E',
                        }}>
                        {!book.coverArt && (
                            <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                                <span className="
                                    text-black text-[clamp(5px,1.8vw,8px)]
                                    text-center leading-tight
                                    tracking-wide uppercase
                                    drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]
                                ">
                                    {book.name.length > 30 ? book.name.slice(0, 10) + '…' : book.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Book pages (right side) */}
                    <div style={{
                        position: 'absolute',
                        right: '-6px',
                        top: '2px',
                        bottom: '2px',
                        width: '5px',
                        background: 'repeating-linear-gradient(90deg, #F5F0E8 0px, #F5F0E8 2px,#E8DFD4 2px, #E8DFD4 4px,#F5F0E8 4px )',
                        borderRadius: '0 2px 2px 0',
                        boxShadow: 'inset -1px 0 1px rgba(0,0,0,0.03), 1px 0 3px rgba(0,0,0,0.08)',
                        zIndex: 1,
                    }} />


                    {/* Top page edge */}
                    <div className="
                        absolute -top-[3px] left-1 right-0 h-[3px] 
                        bg-[#F5F0E8]
                        bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(180,170,155,0.4)_2px,rgba(180,170,155,0.4)_3px)]
                        rounded-t-[1px]
                        origin-top
                    " style={{ transform: 'rotateX(90deg)' }} />
                </div>

                {/* Book info */}
                <div className="pb-1 mx-2 flex-1 min-w-0">
                    <p className="
                        font-serif text-[clamp(0.65rem,2.8vw,0.85rem)] font-semibold 
                        text-[#5A4D3E] leading-tight mb-0.5
                        truncate
                    ">
                        {book.name.length > 35 ? book.name.slice(0, 32) + '…' : book.name}
                    </p>
                    <p className="
                        font-serif text-[clamp(0.55rem,2.2vw,0.72rem)] 
                        text-[#9b7c68] italic
                        truncate
                    ">
                        {book.author?.name}
                    </p>
                </div>
            </div>

            <div className={styles.smallBookshelf} />
        </div>
    );
};

export const TopBooksShelves: React.FC<TopThreeShelvesProps> = ({ books }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%',
        }}>
            {books.map((book, i) =>
                book ? (
                    <SingleBookShelf key={book.id} book={book} rank={i + 1} />
                ) : null
            )}
        </div>
    );
};

const Book: React.FC<BookProps> = ({ books }) => {
    const navigate = useNavigate();
    /*
    return (
        <div
            className={`${styles.book} group cursor-pointer transition-all duration-300 hover:-translate-y-1`}
            onClick={() => navigate(`/book/${book.id}`)}
            title={book.name}
        >
            {/* 3D Book Container *
            <div className="
            relative w-full h-full transform-style-preserve-3d 
            transition-transform duration-300 
            group-hover:translate-y-[-4px] group-hover:rotate-y-[-5deg]">
                {/* Spine — left dark strip *
                <div className="absolute left-0 top-0 w-[6px] h-full bg-[#3D2E1A] rounded-l-[2px] origin-left bg-gradient-to-r from-[#2a1f10] to-[#3D2E1A]"
                    style={{ transform: 'rotateY(90deg)' }} />

                {/* Cover face *
                <div className="absolute inset-0 rounded-[2px_3px_3px_2px] overflow-hidden shadow-[inset_-2px_0_4px_rgba(0,0,0,0.15),inset_1px_0_2px_rgba(255,255,245,0.3)]">
                    {book.coverArt ? (
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${book.coverArt})` }}
                        />
                    ) : (
                        <div className={`w-full h-full ${getBookColor()} flex items-center justify-center p-1`}>
                            <span className="text-[#5A4D41] text-[8px] font-serif text-center leading-tight line-clamp-3">
                                {book.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Book pages (right side) *
                <div className="absolute right-[-4px] top-1 bottom-1 w-[3px] bg-[repeating-linear-gradient(90deg,#F5F0E8_0px,#F5F0E8_1px,#E8DFD4_1px,#E8DFD4_2px,#F5F0E8_2px)] rounded-r-sm shadow-[inset_-1px_0_1px_rgba(0,0,0,0.03),1px_0_2px_rgba(0,0,0,0.05)] z-1" />

                {/* Top page edge *
                <div className="absolute -top-[2px] left-1 right-0 h-[2px] bg-[#F5F0E8] bg-[repeating-linear-gradient(90deg,transparent,transparent_1px,rgba(180,170,155,0.3)_1px,rgba(180,170,155,0.3)_2px)] rounded-t-[1px] origin-top"
                    style={{ transform: 'rotateX(90deg)' }} />
            </div>
        </div>
    );
    */

    return (
        <div className={styles.booksContainer}>
            {books.slice(0, 10).map((book, i) => (
                <div
                    onClick={() => navigate(`/book/${book.id}`)}
                    className={`${styles.bookCard}
                        relative 
                        w-[clamp(100px,70vw,130px)] h-[clamp(95px,64vw,140px)]
                        transform-style-preserve-3d
                        transition-transform duration-300 ease-out
                        drop-shadow-[4px_6px_10px_rgba(0,0,0,0.25)]
                        mx-0 mb-[-10px] ml-[clamp(0px,3vw,30px)]
                        z-10 shrink-0 bottom-[-18px]
                        hover:translate-y-[-4px] hover:rotate-z-[70deg]
                        `}>
                    <Tooltip content={`${book.name}`} />
                    <div
                        className={`${styles.bookCover} 
                        
                        `}
                        style={{
                            transform: 'perspective(400px) rotateY(-20deg)',
                            '--bg-image': book.coverArt ? `url(${book.coverArt})` : `url(${randomColour()})`
                        } as React.CSSProperties}
                    >
                        {
                            !book.coverArt ?
                                (<span className="text-black font-medium">{book.name}</span>) : null
                        }
                    </div>
                    <div className={styles.bookSpine} />
                    <div className={styles.bookPages} />
                    <div className={styles.bookTopEdge} />
                    <div className={styles.bookShadow} />

                </div>
            ))}
        </div>
    );
};

interface ShelfRowProps {
    books: Bk[];
    caption: string;
    onSeeAll?: () => void;
}

const ShelfRow: React.FC<ShelfRowProps> = ({ books, caption, onSeeAll }) => (
    // In your ShelfRow component:
    <div className={styles.shelfRow}>
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E9DC] pb-2">
            <span className={styles.shelvesCaption}>{caption}</span>
            <button
                onClick={onSeeAll}
                className="text-[#9FB89F] hover:text-[#8AA88A] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                SEE ALL <ChevronRight size={14} />
            </button>
        </div>
        <Book books={books} />
        <div className={styles.shelfBoard} />
    </div>
);

export const Shelves: React.FC<ShelvesProps> = ({
    shelf1, shelf1Caption, shelf1SeeAll,
    shelf2 = null, shelf2Caption = "", shelf2SeeAll,
    shelf3 = null, shelf3Caption = "", shelf3SeeAll,
    shelf4 = null, shelf4Caption = "", shelf4SeeAll,
    shelf5 = null, shelf5Caption = "", shelf5SeeAll,
}) => (
    <div className={styles.shelves}>
        {shelf1 && shelf1.length > 0 && <ShelfRow books={shelf1} caption={shelf1Caption} onSeeAll={shelf1SeeAll} />}
        {shelf2 && shelf2.length > 0 && <ShelfRow books={shelf2} caption={shelf2Caption} onSeeAll={shelf2SeeAll} />}
        {shelf3 && shelf3.length > 0 && <ShelfRow books={shelf3} caption={shelf3Caption} onSeeAll={shelf3SeeAll} />}
        {shelf4 && shelf4.length > 0 && <ShelfRow books={shelf4} caption={shelf4Caption} onSeeAll={shelf4SeeAll} />}
        {shelf5 && shelf5.length > 0 && <ShelfRow books={shelf5} caption={shelf5Caption} onSeeAll={shelf5SeeAll} />}
    </div>
);