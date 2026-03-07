
import ErrorPage from "./ErrorPage"

export default function E403() {
    return (
        <>
            <ErrorPage
                statusCode={403}
                CodeTitle="Unauthorised"
                Description="Sorry, You aren't authorised to access this page."
            />
        </>
    );
}
