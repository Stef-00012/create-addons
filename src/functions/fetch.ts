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
			const retryAfter = error.response.headers["Retry-After"];

			if (retryAfter) {
				await sleep(Number.parseInt(retryAfter) * 1000);

				return await ratelimitFetch(url, config);
			}
		}

		throw e
	}
}