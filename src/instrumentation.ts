import { startScheduler } from "./lib/scheduler";

export function register() {
	if (process.env.ENVIRONMENT === "production") {
		startScheduler();
	} else {
		console.log("Fetching is not started in development mode");
	}
}
