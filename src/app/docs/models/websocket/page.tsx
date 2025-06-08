import Divider from "@/components/docs/Divider";
import ModelTable from "@/components/docs/ModelTable";
import { tableHeader, websocketCommandDataArgsRows, websocketCommandDataRows, websocketCommandErrorRows, websocketUpdateDataChangesDataAuthorsRows, websocketUpdateDataChangesDataModloadersArrayRows, websocketUpdateDataChangesDataNumberRows, websocketUpdateDataChangesDataRows, websocketUpdateDataChangesDataSideRows, websocketUpdateDataChangesDataStringArrayRows, websocketUpdateDataChangesDataStringRows, websocketUpdateDataChangesRows, websocketUpdateDataRows, websocketUpdateDataSlugsRows } from "@/constants/models";
import Link from "next/link";

export default function WebSocketModel() {
    return (
        <>
            {/* UpdateMessageData */}
            <Link className="text-5xl link2" href="#UpdateMessageData" id="UpdateMessageData">
				UpdateMessageData
			</Link>

			<p className="py-2">Represents the data of an update message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataRows} />

			<Divider />

            {/* UpdateMessageDataSlugs */}
            <Link className="text-5xl link2" href="#UpdateMessageDataSlugs" id="UpdateMessageDataSlugs">
				UpdateMessageDataSlugs
			</Link>

			<p className="py-2">Represents the addons&apos; slugs in an update message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataSlugsRows} />

			<Divider />

            {/* UpdateMessageDataChanges */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChanges" id="UpdateMessageDataChanges">
				UpdateMessageDataChanges
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesRows} />

			<Divider />

            {/* UpdateMessageDataChangesData */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesData" id="UpdateMessageDataChangesData">
				UpdateMessageDataChangesData
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataRows} />

			<Divider />

            {/* UpdateMessageDataChangesDataString */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataString" id="UpdateMessageDataChangesDataString">
				UpdateMessageDataChangesDataString
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for <code>string</code> values.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataStringRows} />

			<Divider />

			{/* UpdateMessageDataChangesDataAuthors */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataAuthors" id="UpdateMessageDataChangesDataAuthors">
				UpdateMessageDataChangesDataAuthors
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for the <code>authors</code> value.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataAuthorsRows} />

			<Divider />

			{/* UpdateMessageDataChangesDataNumber */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataNumber" id="UpdateMessageDataChangesDataNumber">
				UpdateMessageDataChangesDataNumber
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for <code>number</code> values.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataNumberRows} />

			<Divider />

			{/* UpdateMessageDataChangesDataStringArray */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataStringArray" id="UpdateMessageDataChangesDataStringArray">
				UpdateMessageDataChangesDataStringArray
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for <code>string[]</code> values.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataStringArrayRows} />

			<Divider />

			{/* UpdateMessageDataChangesDataSide */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataSide" id="UpdateMessageDataChangesDataSide">
				UpdateMessageDataChangesDataSide
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for the <code>clientSide</code> and <code>serverSide</code> values.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataSideRows} />

			<Divider />

			{/* UpdateMessageDataChangesDataModloadersArray */}
            <Link className="text-5xl link2" href="#UpdateMessageDataChangesDataModloadersArray" id="UpdateMessageDataChangesDataModloadersArray">
				UpdateMessageDataChangesDataModloadersArray
			</Link>

			<p className="py-2">Represents the addons&apos; changes in an update message for the <code>modloaders</code> value.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketUpdateDataChangesDataModloadersArrayRows} />

			<Divider />

			{/* CommandMessageData */}
            <Link className="text-5xl link2" href="#CommandMessageData" id="CommandMessageData">
				CommandMessageData
			</Link>

			<p className="py-2">Represents the data of a command in a command message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketCommandDataRows} />

			<Divider />

			{/* CommandMessageDataArgs */}
            <Link className="text-5xl link2" href="#CommandMessageDataArgs" id="CommandMessageDataArgs">
				CommandMessageDataArgs
			</Link>

			<p className="py-2">Represents the args of a command in a command message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketCommandDataArgsRows} />

			<Divider />

			{/* CommandErrorMessageData */}
            <Link className="text-5xl link2" href="#CommandErrorMessageData" id="CommandErrorMessageData">
				CommandErrorMessageData
			</Link>

			<p className="py-2">Represents the data of an error in a command error message.</p>

			<h3 className="text-3xl py-2">Fields</h3>

			<ModelTable header={tableHeader} rows={websocketCommandErrorRows} />
        </>
    )
}