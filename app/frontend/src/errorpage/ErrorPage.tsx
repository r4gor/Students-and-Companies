function ErrorPage({ errorType }: { errorType: string }) {
    let errorMessage = "Error 404: Page Not Found";

    if (errorType === "internal_server_error") {
        errorMessage = "Error 500: Internal Server Error";
    }

    return <>{errorMessage}</>;
}

export default ErrorPage;