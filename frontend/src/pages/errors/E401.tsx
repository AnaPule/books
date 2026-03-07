
import ErrorPage from "./ErrorPage"

export default function E401(){
    return(
        <>
            <ErrorPage 
            statusCode={401}
            CodeTitle="Unauthorised"
            Description="Sorry, you lack the permissions to access this page."
            />
        </>
    );
}
