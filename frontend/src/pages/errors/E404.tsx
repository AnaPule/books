
import ErrorPage from "./ErrorPage"

export default function E404() {
    return (
        <>
            <ErrorPage
                statusCode={404}
                CodeTitle="Page Not Found"
                Description="Sorry, we couldn’t find that page you were looking for"
            />
        </>
    );
}
