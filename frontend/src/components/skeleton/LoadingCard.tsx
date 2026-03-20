
interface LoadingProps {
    LoadingSelection?: string; // books , content, bookHeader
}
const DefaultCard: React.FC = () => {
    return (
        <div className="container py-24">
            <div className="flex flex-wrap -m-4">
                <div className="p-4">
                    <div className="h-full w-80 border-2 border-gray-100/25 rounded-lg overflow-hidden shadow-2xl">
                        {/*Image Place Holder*/} <div className="lg:h-48 bg-gray-600/25 dark: bg-gray-600/25 md:h-48 w-full object-cover object-center"></div>
                        <div className="p-6">
                            {/* title place holder */} <h2 className="bg-gray-400/25 animate-pulse h-4 w-1/4 mb-2"></h2>
                            {/* Sub title place holder */} <h1 className="w-1/2 mb-4 h-6 animate-pulse bg-gray-500/25"></h1>

                            {/* Content place holders */}
                            <p className="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400/25"></p>
                            <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400/25"></p>
                            <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400/25"></p>

                            {/* buttons place holders */}
                            <div className="flex items-center flex-wrap ">
                                <a className="bg-indigo-200/25 h-4 animate-pulse mt-2 w-32 inline-flex items-center md:mb-2 lg:mb-0">
                                </a>
                                <span className="bg-indigo-200/25 w-16 mt-2 h-4 animate-pulse mr-3 px-2 inline-flex items-center ml-auto leading-none text-sm pr-5 py-1">

                                </span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const BookCard: React.FC = () => {
    return (
        <>
            <div className="flex flex-wrap flex-col justify-left">
                <div className="p-2">
                    <div className="w-72 h-96 border-2 border-gray-100/25 rounded-lg overflow-hidden shadow-2xl">
                        {/*Image Place Holder*/} <div className="lg:h-full bg-gray-600/25 dark:bg-gray-600/25 md:h-full w-full h-full object-cover object-center"></div>
                    </div>
                </div>

                {/* labels place holders */}
                <div className="my-4">
                    {/* title place holder */} <h2 className="bg-gray-400/25 animate-pulse h-4 w-1/4 mb-2 sm:w-24 md:w-34"></h2>
                    {/* Sub title place holder */} <h1 className="w-1/3 mb-4 h-6 animate-pulse bg-gray-500/25 sm:w-32 md:w-40"></h1>
                </div>
            </div>



        </>
    );
}

const BookHeaderCard: React.FC = () => {
    return (
        <>
            <div
                className="bg-gradient-to-br from-gray-900/50 via-gray-800 to-gray-900/25 py-20 px-8 w-full">
                {/* book details div */}
                <div className="max-w-7xl ml-32 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
                    {/* Book Cover with 3D effect */}
                    <div className="w-72 h-96 border-2 border-gray-100/25 rounded-lg overflow-hidden animate-pulse shadow-2xl">
                        {/*Image Place Holder*/} <div className="lg:h-full bg-gray-600/25 dark:bg-gray-600/25 md:h-full w-full h-full object-cover object-center"></div>
                    </div>
                    {/* details */}
                    <div>
                        {/* title place holder */} <h2 className="bg-gray-400/25 animate-pulse h-6 w-96 mb-2"></h2>
                        {/* Sub title place holder */} <h1 className="w-1/2 mb-4 h-6 animate-pulse bg-gray-500/25"></h1>

                        {/* Content place holders */}
                        <p className="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400/25"></p>
                        <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400/25"></p>
                        <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400/25"></p>

                        {/* buttons place holders */}
                        <div className="flex items-center flex-wrap ">
                            <a className="bg-indigo-200/25 h-4 animate-pulse mt-2 w-32 inline-flex items-center md:mb-2 lg:mb-0">
                            </a>
                            <span className="bg-indigo-200/25 w-16 mt-2 h-4 animate-pulse mr-3 px-2 inline-flex items-center ml-auto leading-none text-sm pr-5 py-1">

                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export const LoadingCards: React.FC<LoadingProps> = ({
    LoadingSelection
}: LoadingProps) => {
    return (
        <>
            {LoadingSelection == 'books' ? (
                <>
                    <BookCard />
                    <BookCard />
                    <BookCard />
                </>
            ) : LoadingSelection == "BookHeader" ? (
                <>
                    <BookHeaderCard />
                </>
            ) : (
                <>
                    <DefaultCard />
                    <DefaultCard />
                    <DefaultCard />
                </>
            )}

        </>
    );
}