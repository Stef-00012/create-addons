import Link from "next/link";

export default function NotFound() {
	return (
		<div className="mx-auto max-w-4xl mt-[30vh] sm:mt-[40vh]">
			<h1>
				error 404 — you&apos;re lost, here&apos;s a link to the{" "}
				<Link href="/" className="link2">
					main page
				</Link>
			</h1>
		</div>
	);
}
