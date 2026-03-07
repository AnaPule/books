
interface NoResultsProps {
    WarningLabel: string
    action?: () => void;
    actionLabel?: string;
}
export const NoResults: React.FC<NoResultsProps> = (
    { WarningLabel,
        actionLabel,
        action
    }
) => {
    return (
        <>
            <div data-v-ad307406="" className="no-results grid grid-flow-col grid-rows-2 gap-4 justify-items-center">
                <div className="group grid grid-cols-3 justify-items-center">
                    <svg
                        data-v-ad307406=""
                        xmlns="http://www.w3.org/2000/svg"
                        width="200" height="200"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="0.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide-animal animal-icon cursor-pointer col-start-2 transition-transform duration-300 hover:rotate-y-180">
                        <path d="M15.236 22a3 3 0 0 0-2.2-5"></path>
                        <path d="M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4">
                        </path><path d="M18 13h.01"></path>
                        <path d="M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10"></path>
                    </svg>
                </div>

                <div className="text-center">
                    <h2 data-v-ad307406="" className="no-results-text">{WarningLabel} </h2>
                    {actionLabel != null &&
                        <button 
                        onClick={action}
                        className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 cursor-pointer capitalize">{actionLabel}</button>
                    }
                </div>

            </div>
        </>
    );
}