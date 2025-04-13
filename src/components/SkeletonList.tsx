export default function SkeletonList() {
	return (
		<div className="card my-4 w-full skeleton skeleton-animated">
			<div className="card-body">
				<div className="flex justify-between items-baseline pb-2">
					<h5 className="card-title mb-0">
						{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
						<a className="skeleton skeleton-animated" href="#">
							Loading
						</a>
					</h5>
					<div className="card-actions skeleton skeleton-animated">
						<a
							className="btn btn-outline btn-primary flex items-center"
							// biome-ignore lint/a11y/useValidAnchor: <explanation>
							href="#"
						>
							<span className="icon-[tabler--link] me-1" />
							Modrinth
						</a>
					</div>
				</div>
				<div className="flex flex-wrap justify-start">
					<div className="flex-wrap sm:flex">
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--hash] pt-2" />{" "}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--download] pt-2" />{" "}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--user] pt-2" />{" "}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--heart] pt-2" />{" "}
						</p>
						<p className="flex items-center mr-2 sm:mr-4">
							<span className="me-1 icon-[tabler--category] pt-2" />{" "}
						</p>
						<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
							<span className="loading loading-spinner loading-lg text-primary" />
						</div>
					</div>
					<p className="flex-grow" />
				</div>
			</div>
		</div>
	);
}
