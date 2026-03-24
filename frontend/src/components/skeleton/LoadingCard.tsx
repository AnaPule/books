interface LoadingProps {
    LoadingSelection?: string; // books, content, bookHeader, trendingTopics
    cardWidth?: string; // For adjustable book card width
    cardHeight?: string; // For adjustable book card height
    count?: number; // Number of cards to show
    // Custom colors
    primaryBg?: string;      // Main background color for cards
    secondaryBg?: string;    // Secondary background for accents
    accentBg?: string;       // Button/accent backgrounds
    textColor?: string;      // Text placeholder color
    borderColor?: string;    // Border color
    cardBg?: string;         // Book card background

    captionColor?: string;
    shelfCount?: number;
    booksPerShelf?: number;
}

// Book card placeholder
const BookCard: React.FC<{
    width?: string;
    height?: string;
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
}> = ({ width = "w-40", height = "h-56", primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#E2E9DC" }) => {
    return (
        <div className="flex flex-col">
            <div className={`${width} ${height} rounded-lg animate-pulse`} style={{ backgroundColor: cardBg }} />
            <div className="mt-2 space-y-1">
                <div className="h-3 rounded animate-pulse w-3/4" style={{ backgroundColor: primaryBg }} />
                <div className="h-2 rounded animate-pulse w-1/2" style={{ backgroundColor: secondaryBg }} />
            </div>
        </div>
    );
};

// Trending topics placeholder
const TrendingTopicsCard: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
}> = ({ primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#FFFCF7", borderColor = "#E2E9DC" }) => {
    return (
        <div className="rounded-xl p-6 border shadow-sm animate-pulse" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: primaryBg }} />
            <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-20 h-8 rounded-full" style={{ backgroundColor: secondaryBg }} />
                ))}
            </div>
        </div>
    );
};

// Content card placeholder
const DefaultCard: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
}> = ({ primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#FFFCF7", borderColor = "#E2E9DC" }) => {
    return (
        <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="h-5 w-32 rounded mb-4 animate-pulse" style={{ backgroundColor: primaryBg }} />
            <div className="space-y-2">
                <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                <div className="h-4 w-1/2 rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                <div className="h-8 w-24 rounded-lg mt-3 animate-pulse" style={{ backgroundColor: primaryBg }} />
            </div>
        </div>
    );
};

// Book header placeholder
const BookHeaderCard: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
}> = ({ primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#E2E9DC", borderColor = "#E8CFC5" }) => {
    return (
        <div className="py-12 px-4 sm:px-6 md:px-8 w-full border-b" style={{ borderColor }}>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                <div className="w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] md:w-[280px] md:h-[420px] lg:w-[320px] lg:h-[480px] rounded-lg animate-pulse" style={{ backgroundColor: cardBg }} />
                <div className="flex-1 w-full space-y-4">
                    <div className="h-10 w-3/4 rounded animate-pulse mx-auto lg:mx-0" style={{ backgroundColor: primaryBg }} />
                    <div className="h-6 w-1/2 rounded animate-pulse mx-auto lg:mx-0" style={{ backgroundColor: secondaryBg }} />
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <div className="h-5 w-20 rounded animate-pulse" style={{ backgroundColor: primaryBg }} />
                        <div className="h-5 w-20 rounded animate-pulse" style={{ backgroundColor: primaryBg }} />
                        <div className="h-5 w-20 rounded animate-pulse" style={{ backgroundColor: primaryBg }} />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                        <div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                        <div className="h-4 w-4/6 rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4">
                        <div className="h-10 w-32 rounded-full animate-pulse" style={{ backgroundColor: primaryBg }} />
                        <div className="h-10 w-10 rounded-full animate-pulse" style={{ backgroundColor: secondaryBg }} />
                        <div className="h-10 w-10 rounded-full animate-pulse" style={{ backgroundColor: secondaryBg }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// info card
export const InfoCard: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
}> = ({
    primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#E2E9DC", borderColor = "#E8CFC5" }) => {
        return (
            <div style={{ borderColor: borderColor, backgroundColor: cardBg }} className="bg-[#FFFCF7] rounded-xl p-4 md:p-6 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div style={{ backgroundColor: primaryBg }} className="w-4 h-4 rounded animate-pulse" />
                    <div style={{ backgroundColor: secondaryBg }} className="h-6 w-40 rounded animate-pulse" />
                </div>
                <div className="space-y-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i}>
                            <div className="flex justify-between mb-1">
                                <div style={{ backgroundColor: primaryBg }} className="h-4 w-32 rounded animate-pulse" />
                                <div style={{ backgroundColor: primaryBg }} className="h-4 w-8 rounded animate-pulse" />
                            </div>
                            <div style={{ backgroundColor: primaryBg }} className="w-full h-1.5 rounded-full animate-pulse" />
                            <div style={{ backgroundColor: secondaryBg }} className="h-3 w-24 rounded animate-pulse mt-1.5" />
                        </div>
                    ))}
                </div>
                <div style={{ backgroundColor: primaryBg }} className="w-full h-9 rounded-lg animate-pulse mt-5" />
            </div>
        );
    }

// Loading state for Genre Filter & Reading Challenges
export const GenreLoadingState: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
}> = ({
    primaryBg = "#D4E3D4", secondaryBg = "#E2E9DC", cardBg = "#FFFCF7", borderColor = "#E2E9DC"
}) => {
        return (
            <div className="space-y-6">
                {/* Browse by Genre Loading */}
                <div style={{ borderColor: borderColor, backgroundColor: cardBg }} className="verflow-y-auto rounded-xl p-4 md:p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-2 sticky top-0 bg-[#FFFCF7]">
                        <div style={{ backgroundColor: primaryBg }} className="w-4 h-4 rounded animate-pulse" />
                        <div style={{ backgroundColor: primaryBg }} className="h-6 w-32 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-2.5">
                                <div className="flex justify-between items-center">
                                    <div style={{ backgroundColor: primaryBg }} className="h-5 w-24 rounded animate-pulse" />
                                    <div style={{ backgroundColor: secondaryBg }} className="w-4 h-4 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


// shelves loading 
export const ShelvesLoadingState: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
    captionColor?: string;
    shelfCount?: number;
    booksPerShelf?: number;
}> = ({
    primaryBg = "#D4E3D4",
    secondaryBg = "#E2E9DC",
    cardBg = "#E2E9DC",
    borderColor = "#E2E9DC",
    captionColor = "#D4E3D4",
    shelfCount = 3,
    booksPerShelf = 5
}) => {
        const renderShelfRow = (key: number) => (
            <div key={key} className="mb-8">
                {/* Caption */}
                <div className="flex items-center justify-between mb-4 border-b border-[#E2E9DC] pb-2">
                    <div className="h-5 w-32 rounded animate-pulse" style={{ backgroundColor: captionColor, opacity: 0.5 }} />
                    <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: primaryBg }} />
                </div>

                {/* Books row */}
                <div className="flex gap-4">
                    {Array(booksPerShelf).fill(null).map((_, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className={`w-24 h-36 rounded-lg animate-pulse`} style={{ backgroundColor: cardBg }} />
                            <div className="mt-2 space-y-1">
                                <div className="h-3 rounded animate-pulse w-20" style={{ backgroundColor: primaryBg }} />
                                <div className="h-2 rounded animate-pulse w-14" style={{ backgroundColor: secondaryBg }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shelf board */}
                <div className="mt-4 w-full h-4 rounded animate-pulse" style={{ backgroundColor: borderColor, opacity: 0.5 }} />
            </div>
        );

        return (
            <div className="space-y-6">
                {Array(shelfCount).fill(null).map((_, i) => renderShelfRow(i))}
            </div>
        );
    };

//vertical shelves loading
export const TopBooksShelvesLoadingState: React.FC<{
    primaryBg?: string;
    secondaryBg?: string;
    cardBg?: string;
    borderColor?: string;
    rankColor?: string;
    count?: number;
}> = ({
    primaryBg = "#D4E3D4",
    secondaryBg = "#E2E9DC",
    cardBg = "#E2E9DC",
    borderColor = "#E2E9DC",
    rankColor = "#C9B27C",
    count = 5
}) => {
        return (
            <div className="space-y-6">
                {Array(count).fill(null).map((_, idx) => (
                    <div key={idx} className="flex items-end gap-3 pl-4">
                        {/* Rank number */}
                        <div className="h-8 w-6 rounded animate-pulse" style={{ backgroundColor: rankColor, opacity: 0.5 }} />

                        {/* Book cover */}
                        <div className={`w-16 h-24 rounded-lg animate-pulse`} style={{ backgroundColor: cardBg }} />

                        {/* Book info */}
                        <div className="flex-1 space-y-2 pb-1">
                            <div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: primaryBg }} />
                            <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: secondaryBg }} />
                        </div>
                    </div>
                ))}

                {/* Shelf board */}
                <div className="mt-2 w-full h-4 rounded animate-pulse" style={{ backgroundColor: borderColor, opacity: 0.5 }} />
            </div>
        );
    };

export const LoadingCards: React.FC<LoadingProps> = ({
    LoadingSelection = "books",
    cardWidth = "w-40",
    cardHeight = "h-56",
    count = 3,
    primaryBg = "#D4E3D4",
    secondaryBg = "#E2E9DC",
    accentBg = "#C9A394",
    textColor = "#D4E3D4",
    borderColor = "#E2E9DC",
    cardBg = "#E2E9DC",

    shelfCount = 2,
    booksPerShelf = 3,
}) => {
    const renderBooks = () => {
        return Array(count).fill(null).map((_, i) => (
            <BookCard
                key={i}
                width={cardWidth}
                height={cardHeight}
                primaryBg={primaryBg}
                secondaryBg={secondaryBg}
                cardBg={cardBg}
            />
        ));
    };

    switch (LoadingSelection) {
        case "books":
            return <div className="flex flex-wrap gap-4">{renderBooks()}</div>;
        case "BookHeader":
            return <BookHeaderCard primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />;
        case "trendingTopics":
            return <TrendingTopicsCard primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />;
        case "genres":
            return <GenreLoadingState primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />;
        case "info":
            return <InfoCard primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />;
        case "shelves":
            return <ShelvesLoadingState
                primaryBg={primaryBg}
                secondaryBg={secondaryBg}
                cardBg={cardBg}
                captionColor={textColor}
                borderColor={borderColor}
                shelfCount={shelfCount}
                booksPerShelf={booksPerShelf}
            />;
        case "topBooksShelves":
            return <TopBooksShelvesLoadingState
                primaryBg={primaryBg}
                secondaryBg={secondaryBg}
                cardBg={cardBg}
                borderColor={borderColor}
                count={5}
            />;
        case "content":
            return (
                <div className="space-y-4">
                    {Array(count).fill(null).map((_, i) => (
                        <DefaultCard key={i} primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />
                    ))}
                </div>
            );
        default:
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(count).fill(null).map((_, i) => (
                        <DefaultCard key={i} primaryBg={primaryBg} secondaryBg={secondaryBg} cardBg={cardBg} borderColor={borderColor} />
                    ))}
                </div>
            );
    }
};