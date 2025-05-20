import axios, {
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
} from "axios";
import { promisify } from "node:util";

const sleep = promisify(setTimeout);

export async function ratelimitFetch(
	url: string,
	config?: AxiosRequestConfig | undefined,
): Promise<AxiosResponse> {
	try {
		const res = await axios.get(url, config);

		return res;
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 429) {
			const retryAfter = error.response.headers["x-ratelimit-reset"];

			console.log(`\x1b[31mRate limit hit, retrying in \x1b[0;1m${retryAfter} \x1b[0;31mseconds...\x1b[0m`);

			if (retryAfter) {
				await sleep(Number.parseInt(retryAfter) * 1000);
				console.log("\x1b[33mRetrying...\x1b[0m");

				return await ratelimitFetch(url, config);
			}
		} else if (error?.response?.status === 408) {
			console.log("\x1b[31mRequest timed out, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m");

			await sleep(1000);

			return await ratelimitFetch(url, config);
		} else if (error?.response?.status === 502) {
			console.log("\x1b[31mBad gateway, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m");

			await sleep(1000);

			return await ratelimitFetch(url, config);
		} else {
			throw e;
		}
	}

	return {} as AxiosResponse;
}
