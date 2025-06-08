import ms from "enhanced-ms"

export default function APIRatelimitsDocs() {
    const msInterval = ms(process.env.NEXT_PUBLIC_RATELIMIT_REQUEST_INTERVAL as string || "1m") || 60000;
    const interval = ms(msInterval);
    const requests = process.env.NEXT_PUBLIC_RATELIMIT_REQUEST_AMOUNT || "100";

    return (
        <>
            <h1 className="text-3xl">API Rate Limits</h1>

            <p>
                The Create Addons API has a ratelimit of {requests} requests per {interval}.
            </p>

            <p>
                If you exceed these limits, you will receive a <code>429</code> &quot;Too Many Requests&quot; error. Please wait until the rate limit resets before making additional requests.
            </p>
        </>
    )
}