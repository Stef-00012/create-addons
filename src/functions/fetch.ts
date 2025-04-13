import axios, {
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
} from "axios";
import { promisify } from "node:util";

const sleep = promisify(setTimeout);

export async function ratelimitFetch(
	url: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	config?: AxiosRequestConfig<any> | undefined,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<AxiosResponse<any, any>> {
	try {
		const res = await axios.get(url, config);

		return res;
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 429) {
			const retryAfter = error.response.headers["x-ratelimit-reset"];
			console.log(`Rate limit hit, retrying in ${retryAfter} seconds...`);

			if (retryAfter) {
				await sleep(Number.parseInt(retryAfter) * 1000);
				console.log("Retrying...");

				return await ratelimitFetch(url, config);
			}
		} else if (error?.response?.status === 408) {
			console.log("Request timed out, retrying in 1 second...");

			await sleep(1000);

			return await ratelimitFetch(url, config);
		} else if (error?.response?.status === 502) {
			console.log("Bad gateway, retrying in 1 second...");

			await sleep(1000);

			return await ratelimitFetch(url, config);
		} else {
			throw e;
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return {} as AxiosResponse<any, any>;
}
