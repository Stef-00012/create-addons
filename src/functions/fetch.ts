import axios, { type AxiosResponse, type AxiosError, type AxiosRequestConfig } from "axios";
import { promisify } from "node:util";
const sleep = promisify(setTimeout);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function ratelimitFetch(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<any, any>> {
	try {
		const res = await axios.get(url, config);

		return res;
	} catch (e) {
        const error = e as AxiosError

		if (error?.response?.status === 429) {
			console.log(error.response.headers)
			const retryAfter = error.response.headers["Retry-After"];
			console.log(`Rate limit hit, retrying in ${retryAfter} seconds...`);
			
			if (retryAfter) {
				await sleep(Number.parseInt(retryAfter) * 1000);
				console.log("retrying...");

				return await ratelimitFetch(url, config);
			}
		} else {
			throw e;
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return {} as AxiosResponse<any, any>;
}