import { getClientIp } from "@/lib/getClientIp";
import type { NextRequest } from "next/server";
import { type Duration, Ratelimit } from '@upstash/ratelimit';
import { Redis } from "@upstash/redis";

export default async function ratelimitHandler(
	req: NextRequest,
	next: (headers: Headers) => Response | Promise<Response>,
) {

	const requestAmount =
		Number.parseInt(process.env.RATELIMIT_REQUEST_AMOUNT as string) || 100;
	const requestInterval = process.env.RATELIMIT_REQUEST_INTERVAL as string || "1m";

	const clientIp = getClientIp(req);

    const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(requestAmount, requestInterval as Duration),
        analytics: false
    })

    
	const key = `ratelimit:${clientIp}`;
    
	const { success, limit, remaining, reset } = await ratelimit.limit(key);

	console.info(
		`${success ? "" : "Ratelimited - "}Ratelimit increased for ${clientIp} (${remaining} remaining of ${limit}), reset at ${new Date(reset).toISOString()}`,
	);

	const headers = new Headers();

	headers.append("X-RateLimit-Limit", limit.toString());
	headers.append("X-RateLimit-Remaining", remaining.toString());
	headers.append("X-Retry-After", Math.ceil(reset / 1000).toString());

	if (!success) {
		return Response.json(
			{
				error: "You are being ratelimited",
			},
			{
				status: 429,
				statusText: "Too Many Requests",
				headers: headers,
			},
		);
	}

	return await next(headers);
}
