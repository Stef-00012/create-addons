import axios, {
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
} from "axios";

const REQUEST_TIMEOUT = 15000;

async function withHardTimeout<T = AxiosResponse>(
	promise: Promise<T>,
	timeoutMs: number,
	errorMessage: string
): Promise<T> {
	let timeoutHandle: NodeJS.Timeout | null = null;;
	
	const timeoutPromise = new Promise<T>((_, reject) => {
		timeoutHandle = setTimeout(() => {
			reject({
				response: {
					status: 408,
					statusText: errorMessage,
				}
			});
		}, timeoutMs);
	});
	
	try {
		const result = await Promise.race([promise, timeoutPromise]);
		
		if (timeoutHandle) clearTimeout(timeoutHandle);
		
		return result;
	} catch (error) {
		if (timeoutHandle) clearTimeout(timeoutHandle);

		throw error;
	}
}

export async function ratelimitFetch(
	url: string,
	config?: AxiosRequestConfig | undefined,
): Promise<AxiosResponse> {
	try {
		const res = await withHardTimeout(
			axios.get(url, {
				timeout: REQUEST_TIMEOUT,
				transitional: {
					clarifyTimeoutError: true,
				},
				headers: {
					"User-Agent": `CreateAddons/1.0 (https://git.stefdp.com/Stef/create-addons)`,
					...(config?.headers || {}),
				},
				...config,
			}),
			REQUEST_TIMEOUT,
			`GET request timed out after ${REQUEST_TIMEOUT}ms for ${url}`
		)

		return res;
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 429) {
			const retryAfter = error.response.headers["x-ratelimit-reset"];

			console.info(
				`\x1b[31mRate limit hit, retrying in \x1b[0;1m${retryAfter} \x1b[0;31mseconds...\x1b[0m`,
			);

			if (retryAfter) {
				await Bun.sleep(Number.parseInt(retryAfter, 10) * 1000);
				console.info("\x1b[33mRetrying...\x1b[0m");

				return await ratelimitFetch(url, config);
			}
		} else if (error?.response?.status === 408) {
			console.info(
				"\x1b[31mRequest timed out, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m",
			);

			await Bun.sleep(1000);

			return await ratelimitFetch(url, config);
		} else if (error?.response?.status === 502) {
			console.info(
				"\x1b[31mBad gateway, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m",
			);

			await Bun.sleep(1000);

			return await ratelimitFetch(url, config);
		} else {
			throw e;
		}
	}

	return {} as AxiosResponse;
}

export async function ratelimitPost(
	url: string,
	data?: unknown,
	config?: AxiosRequestConfig | undefined,
): Promise<AxiosResponse> {
	try {
		const res = await withHardTimeout(
			axios.post(url, data, {
				timeout: REQUEST_TIMEOUT,
				transitional: {
					clarifyTimeoutError: true,
				},
				headers: {
					"User-Agent": `CreateAddons/1.0 (https://git.stefdp.com/Stef/create-addons)`,
					...(config?.headers || {}),
				},
				...config,
			}),
			REQUEST_TIMEOUT,
			`POST request timed out after ${REQUEST_TIMEOUT}ms for ${url}`
		)

		return res;
	} catch (e) {
		const error = e as AxiosError;

		if (error?.response?.status === 429) {
			const retryAfter = error.response.headers["x-ratelimit-reset"];

			console.info(
				`\x1b[31mRate limit hit, retrying in \x1b[0;1m${retryAfter} \x1b[0;31mseconds...\x1b[0m`,
			);

			if (retryAfter) {
				await Bun.sleep(Number.parseInt(retryAfter) * 1000);
				console.info("\x1b[33mRetrying...\x1b[0m");

				return await ratelimitPost(url, data, config);
			}
		} else if (error?.response?.status === 408) {
			console.info(
				"\x1b[31mRequest timed out, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m",
			);

			await Bun.sleep(1000);

			return await ratelimitPost(url, data, config);
		} else if (error?.response?.status === 502) {
			console.info(
				"\x1b[31mBad gateway, retrying in \x1b[0;1m1 \x1b[0;31msecond...\x1b[0m",
			);

			await Bun.sleep(1000);

			return await ratelimitPost(url, data, config);
		} else {
			throw e;
		}
	}

	return {} as AxiosResponse;
}
