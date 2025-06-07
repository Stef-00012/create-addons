import Select from "react-select";

interface Option {
	value: string;
	label: string;
}

interface Props {
	defaultValue?: Option;
	options: Option[];
	value?: Option | null;
	isLoading?: boolean;
	isDisabled?: boolean;
	onChange: (newValue: Option | null) => Promise<void> | void;
	label?: string;
}

export default function FilterSelect({
	defaultValue,
	options,
	value,
	label,
	isLoading = false,
	isDisabled = false,
	onChange,
}: Props) {
	return (
		<div className="select-floating w-54 my-4 md:my-0">
			{label && (
				<label
					className="select-floating-label rounded-2xl px-2 z-10 flex items-center"
					htmlFor="selectFloating"
				>
					<span className="icon-[tabler--filter] me-2 size-5 shrink-0" />
					{label}
				</label>
			)}

			<Select
				id="selectFloating"
				defaultValue={defaultValue}
				options={options}
				value={value}
				unstyled
				isSearchable={false}
				isLoading={isLoading}
				isDisabled={isDisabled}
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null,
				}}
				classNames={{
					control: ({ isDisabled }) =>
						`select ${isDisabled ? "bg-base-100/50 border-none text-base-content/50" : ""}`,
					option: ({ isSelected }) =>
						`rounded-2xl my-1 p-2 ${isSelected ? "bg-base-200" : "bg-base-100 hover:bg-base-200"}`,
					menuList: () => "rounded-2xl bg-base-100 py-4 shadow-lg px-2 mt-1",
				}}
				onChange={onChange}
			/>
		</div>
	);
}
