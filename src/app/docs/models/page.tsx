export default function ModelsReferenceDocs() {
	return (
		<>
			<h1 className="text-3xl">Models Reference</h1>

			<ul className="pt-6 list-disc list-inside marker:text-primary">
				<li>
					If a type has <code>?</code> in its definitions, it means that the
					property can be missing or <code>undefined</code>.
				</li>
				<li>
					If a type has <code>[]</code> in its definitions, it means that the
					property is an array.
				</li>
				<li>
					If a type has <code>|</code> in its definitions, it stands for{" "}
					<code>OR</code> and it means that the property can be either one of
					the types.
				</li>
				<li>
					If a type has <code>(...)</code> in its definitions, it stands as a
					group.
				</li>
				<li>
					If a type has <code>[type]</code> in its definitions, it means that it
					accepts any key that follows that type.
				</li>
			</ul>

			<h1 className="text-3xl pt-6">Examples</h1>

			<ul className="pt-6 list-disc list-inside marker:text-primary">
				<li>
					<code>name?: string;</code> means that <code>name</code> can be a
					string or missing/ or <code>undefined</code>.
				</li>
				<li>
					<code>names: string[];</code> means that <code>names</code> is an
					array of strings (<code>["name1", "name2"]</code>).
				</li>
				<li>
					<code>names: ("name1" | "name2")[];</code> means that{" "}
					<code>names</code> is an array that can contain either{" "}
					<code>name1</code>, <code>name2</code> or both.
				</li>
				<li>
					<code>name: "hello" | "world" | "123";</code> means that{" "}
					<code>name</code> can either be <code>hello</code>, <code>world</code>{" "}
					or <code>123</code>.
				</li>
				<li>
					<code>name: "example" | "types" | string;</code> means that{" "}
					<code>name</code> can either be <code>example</code>,{" "}
					<code>types</code> or any other string.
				</li>
				<li>
					<code>[string]: string | null;</code> means that the key is an object
					that accepts any key of type <code>string</code> and values{" "}
					<code>string</code> or <code>number</code> like
					<br />
					<code>
						{`{
								"myString": "hello",
								"something": "world",
								"myNumber": 123,
								"somethingElse": 456
							}`}
					</code>
					.
				</li>
			</ul>
		</>
	);
}
