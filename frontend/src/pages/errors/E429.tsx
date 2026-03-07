
import ErrorPage from "./ErrorPage"

export default function E429() {
    return (
        <>
            <ErrorPage
                statusCode={429}
                CodeTitle="Too Many Requests"
                Description="Please try again in a minute."
            />
        </>
    );
}
