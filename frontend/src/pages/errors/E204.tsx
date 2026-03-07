
import ErrorPage from "./ErrorPage"

export default function E204() {
    return (
        <>
            <ErrorPage
                statusCode={204}
                CodeTitle="No Content"
                Description="Sorry, This page has no content"
            />
        </>
    );
}
