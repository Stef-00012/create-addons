interface Props {
	onSwitchChange?: () => void;
	label: string;
	isDisabled?: boolean;
}

export default function Switch({ onSwitchChange, label, isDisabled }: Props) {
	return (
		<div className="flex items-center gap-1">
			<input
				disabled={isDisabled}
				type="checkbox"
				className="switch switch-primary text-base-content bg-base-100 checked:bg-base-content checked:text-base-100 border-base-content/50 checked:border-base-300/40 disabled:text-base-content/50 disabled:bg-base-100/50 disabled:checked:bg-base-content/50 disabled:checked:text-base-100/50"
				id="createVersionSwitch"
				onChange={onSwitchChange}
			/>
			<label className="label-text text-base" htmlFor="createVersionSwitch">
				{" "}
				{label}{" "}
			</label>
		</div>
	);
}
