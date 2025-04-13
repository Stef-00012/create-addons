export default function SkeletonCard() {
	return (
		<div className="card sm:max-w-lg my-4 sm:my-0 skeleton skeleton-animated sm:flex-auto">
			<div className="card-body">
				<h5 className="card-title mb-0">Loading...</h5>
				<ul>
					<li>
						<span className="icon-[tabler--hash] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--hash] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--download] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--user] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--heart] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--category] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--text-caption] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
					<li>
						<span className="icon-[tabler--link] pt-2" />
						<p className="skeleton skeleton-animated pr-70" />
					</li>
				</ul>
			</div>
			<div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		</div>
	);
}
