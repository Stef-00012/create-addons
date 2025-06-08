import { getClientIp } from "@/lib/getClientIp";
import type { NextRequest } from "next/server";
import ms from "enhanced-ms";

interface RateLimitEntry {
    count: number;
    resetTime: number;
};

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

export default async function ratelimitHandler(
	req: NextRequest,
	next: (headers: Headers) => Response | Promise<Response>,
) {
	const requestAmount =
		Number.parseInt(process.env.NEXT_PUBLIC_RATELIMIT_REQUEST_AMOUNT as string) || 100;
	const requestInterval = ms(process.env.NEXT_PUBLIC_RATELIMIT_REQUEST_INTERVAL as string || "1m") || 60000;

	let clientIp = getClientIp(req);
    if (!clientIp) clientIp = "__UNKNOWN";

	const now = Date.now();

	let rateLimitEntry = rateLimitStore.get(clientIp);

	if (!rateLimitEntry || now >= rateLimitEntry.resetTime) {
        rateLimitEntry = {
            count: 1,
            resetTime: now + requestInterval,
        };

        rateLimitStore.set(clientIp, rateLimitEntry);
    } else {
        rateLimitEntry.count += 1;

		rateLimitStore.set(clientIp, rateLimitEntry);

        if (rateLimitEntry.count > requestAmount) {
            const retryAfter = Math.ceil((rateLimitEntry.resetTime - now) / 1000);

            return Response.json({
				error: "You are being rate limited",
				code: 429
			}, {
                status: 429,
                headers: {
                    "Retry-After": retryAfter.toString(),
                },
            });
        }
    }

	const headers = new Headers();

    headers.set("X-RateLimit-Limit", requestAmount.toString());
    headers.set("X-RateLimit-Remaining", (requestAmount - rateLimitEntry.count).toString());
    headers.set("X-RateLimit-Reset", Math.ceil(rateLimitEntry.resetTime / 1000).toString());

	return await next(headers);
}
