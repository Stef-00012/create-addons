import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string | null {
	const xForwardedFor = req.headers.get("x-forwarded-for");

	if (xForwardedFor) {
		return xForwardedFor.split(",")[0].trim();
	}

	return (
		req.headers.get("x-cluster-client-ip") ||
		req.headers.get("cf-connecting-ip") ||
		req.headers.get("x-client-ip") ||
		req.headers.get("x-real-ip") ||
		null
	);
}
