/**
 * Perform an HTTP request using the fetch API.
 *
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method (e.g., "GET", "POST").
 * @param {Object} payload - The data to send in the request body.
 * @param {Object} queryParams - The URL parameters as key-value pairs.
 * @param {Object} options - Additional options for the request.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response.
 * @throws {Error} - If the request fails or encounters an error.
 */
export async function getData(
    url: string,
    method = "POST",
    payload: Record<string, any> = {},
    queryParams: Record<string, any> = {},
    options: Record<string, any> = {}
) {
    try {
        // Validate that 'url' is a non-empty string
        if (typeof url !== "string" || url.trim() === "") {
            throw new Error("The provided URL is not valid.");
        }

        // Validate that 'method' is a valid HTTP method
        const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
        if (!validMethods.includes(method.toUpperCase())) {
            throw new Error("The provided HTTP method is not valid.");
        }

        // Build URL if continue with query parameters
        const searchParams = new URLSearchParams(queryParams).toString();
        const urlWithParams = searchParams ? `${url}?${searchParams}` : url;

        // Add authentication token handling here
        const loggedIn = true;
        // Temporarily

        options.headers = options.headers || {};

        // Configure the "Content-Type" header
        if (method !== "GET")
            options.headers["Content-Type"] =
                options.headers["Content-Type"] || "application/json; charset=utf-8";

        // Add the authentication token if authenticated
        if (loggedIn) options.headers.authorization = options.headers.authorization || null;

        const headers = new Headers(options.headers);

        const configRequest: RequestInit = {
            method,
            headers: headers,
            // mode: 'no-cors',
            // redirect: 'follow',
            body: JSON.stringify(payload)
        };

        if (method === "GET") delete configRequest.body;

        const response = await fetch(`${urlWithParams}`, configRequest);

        // const validResponseStatus = [200, 202]
        // if (validResponseStatus.includes(response?.status)) {

        if (response.ok) {
            return await response.json();
        } else {
            // Handle specific status code errors here
            console.log(response);
            throw new Error(`Request error: ${response.status}`);
        }
    } catch (error) {
        // Handle general errors here
        console.log(error);
        throw new Error(`Request error: ${error}`);
    }
}

export async function getApiData(
    url: string,
    method = "POST",
    payload: Record<string, any> = {},
    queryParams: Record<string, any> = {},
    options: Record<string, any> = {}
) {
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTU0MTAwNDMsImlhdCI6MTY5NTA1MDA0MywiaXNzIjoiTW9iaWxlaW5zaWdodCIsInVzZXJfaWQiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsInVwbiI6Imp2aWxhQHRyb2NnbG9iYWwuY29tIiwiZW1haWwiOiJqdmlsYUB0cm9jZ2xvYmFsLmNvbSIsImdpdmVuX25hbWUiOiJKdWFuIiwiZmFtaWx5X25hbWUiOiJWaWxhIiwibmFtZSI6Ikp1YW4gVmlsYSIsImRpc3BsYXlfbmFtZSI6Ikp1YW4gVmlsYSIsImlkIjoianZpbGFAdHJvY2dsb2JhbC5jb20iLCJhdXRoX21ldGhvZCI6ImFkZnMiLCJhdXRoX3Rva2VuIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKU1V6STFOaUlzSW5nMWRDSTZJbU54UW5kdVJrTmlaMjVPZVdrNFNrRlBUekpzZEhWVE56Um9WU0o5LmV5SmhkV1FpT2lKdGFXTnliM052Wm5RNmFXUmxiblJwZEhselpYSjJaWEk2Ym1GMmFXZGhkRzl5WDJSbGRpNWhaR1p6TG1sa1pXNTBhV1pwWlhJaUxDSnBjM01pT2lKb2RIUndjem92TDNOemJ5NTBjbTlqWjJ4dlltRnNMbU52YlM5aFpHWnpMM05sY25acFkyVnpMM1J5ZFhOMElpd2lhV0YwSWpveE5qazFNRFV3TURRekxDSmxlSEFpT2pFMk9UVXdOVE0yTkRNc0ltVnRZV2xzSWpvaWFuWnBiR0ZBZEhKdlkyZHNiMkpoYkM1amIyMGlMQ0puYVhabGJsOXVZVzFsSWpvaVNuVmhiaUlzSW1aaGJXbHNlVjl1WVcxbElqb2lWbWxzWVNJc0ltZHliM1Z3SWpwYklrUnZiV0ZwYmlCVmMyVnljeUlzSWxaUVRpQlZjMlZ5Y3lJc0lrRlhVeTAyTXpjMk5qQXpNRGN5TkRBdFJHRnphR0p2WVhKa0lsMHNJblZ3YmlJNkltcDJhV3hoUUhSeWIyTm5iRzlpWVd3dVkyOXRJaXdpWVd4MFpYSnVZWFJsUlcxaGFXd2lPaUpxYVhacGJHRkFiM1YwYkc5dmF5NWpiMjBpTENKRWFYTndiR0Y1TFU1aGJXVWlPaUpLZFdGdUlGWnBiR0VpTENKaGNIQjBlWEJsSWpvaVVIVmliR2xqSWl3aVlYQndhV1FpT2lKdVlYWnBaMkYwYjNKZlpHVjJMbUZrWm5NdVkyeHBaVzUwWDJsa0lpd2lZWFYwYUcxbGRHaHZaQ0k2SW5WeWJqcHZZWE5wY3pwdVlXMWxjenAwWXpwVFFVMU1Pakl1TURwaFl6cGpiR0Z6YzJWek9sQmhjM04zYjNKa1VISnZkR1ZqZEdWa1ZISmhibk53YjNKMElpd2lZWFYwYUY5MGFXMWxJam9pTWpBeU15MHdPUzB4T0ZReE5Ub3hORG93TWk0NE5UUmFJaXdpZG1WeUlqb2lNUzR3SWl3aWMyTndJam9pYjNCbGJtbGtJbjAuV25rd2Rpb3FCTDRYZk5ESXJxVlVYcTBxalBoTFc3Tk1yVmVpNi04MWhCUFBaeWtYbFJYNno1aUhGN25iMExlMThMUnM5ZGd5bVJCSEZHYzI4TjZvbmw3OHlnc0dyWmcyaU41bndHRGNtSzNMQk5LenRXbVZWc01IR19wektPRmt3T2UzZGRiSXdVaTEzWlQ5cXlmVDhIMVpKLUdzYkFCclFxXzBvWUtIcmVUX0xpeHIxODRCWk1zVi1OMFkwUVh3UEZOS2FxUC1lYzFWUmVQREdfc005d0IyTnNhYkUtWndpZ0h5dXltX1FJZWNYajVtTl80VU5oUkRJUjdvZjJSTEtqTEE2UjFBVmJuamlIM2VrNGVRNi1sNUpyUjJwSGtCZFdtTWdRV0xaX1BGRjZuZHV6eEFlcjRvN0NVZE91UFpYa2xIdHg5SjhCR0d1UU9WUlpqYWZRIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsInVzZXJuYW1lIjoianZpbGFAdHJvY2dsb2JhbC5jb20ifQ.WWf18kYc6G3wn3qUK7FJQfcXC5FMILNZHFCVsHpXULQ";

    const headers = {
        authorization: `Bearer ${token}`,
        // origin: 'https://navigator.mobileinsight.com',
        accept: "application/json, text/plain, */*"
    };
    return await getData(url, method, payload, queryParams, {...options, headers});
}
