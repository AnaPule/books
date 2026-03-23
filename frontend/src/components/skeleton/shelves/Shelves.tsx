import type { Book as Bk } from "@models/Book";
import styles from "./shelves.module.css";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
interface ShelvesProps {
    shelf1: Bk[];
    shelf1Caption: string;
    shelf2?: Bk[] | null;
    shelf2Caption?: string;
    shelf3?: Bk[] | null;
    shelf3Caption?: string;
}

interface BookProps {
    book: Bk;
    index: number;
}

const Book: React.FC<BookProps> = ({ book, index }) => {
    const navigate = useNavigate();
    const isEven = index % 2 === 0;

    return (
        <div
            className={`${styles.book} ${isEven ? styles.bookEven : styles.bookOdd}`}
            style={{ '--bg-image': `url(${book.coverArt})` } as React.CSSProperties}
            onClick={() => navigate(`/book/${book.id}`)}
            title={book.name}
        />
    );
};

interface ShelfRowProps {
    books: Bk[];
    caption: string;
}

const ShelfRow: React.FC<ShelfRowProps> = ({ books, caption }) => (
    <div>
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E9DC] pb-2">
            <span className={styles.caption}>{caption}</span>
            <button className="text-[#9FB89F] hover:text-[#8AA88A] flex items-center gap-2 transition-colors text-xs sm:text-sm">
                SEE ALL <ChevronRight size={14} className="sm:size-4" />
            </button>
        </div>
        
        <div className={styles.books}>
            {books.slice(0, 10).map((book, i) => (
                <Book key={i} book={book} index={i} />
            ))}
        </div>
        <div className={styles.bookshelf}>

        </div>
    </div>
);

export const Shelves: React.FC<ShelvesProps> = ({
    shelf1, shelf1Caption,
    shelf2 = null, shelf2Caption = "Next Up",
    shelf3 = null, shelf3Caption = "Finished",
}) => (
    <div className={styles.shelves}>
        {shelf1 && shelf1.length > 0 && <ShelfRow books={shelf1} caption={shelf1Caption} />}
        {shelf2 && shelf2.length > 0 && <ShelfRow books={shelf2} caption={shelf2Caption} />}
        {shelf3 && shelf3.length > 0 && <ShelfRow books={shelf3} caption={shelf3Caption} />}
    </div>
);