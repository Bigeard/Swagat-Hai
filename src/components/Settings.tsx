import { RefObject, useEffect, useRef, useState } from "react";
import { Cog6ToothIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addList, deleteList, getAllMeta } from "../services/Idb";
import { isWordList } from "../services/validatorDataWordList";

interface SettingsProps {
    inputGuessRef: RefObject<HTMLInputElement>;
    onLoadWordList: (id: string) => void;
}

export default function Settings(
    { inputGuessRef, onLoadWordList }: SettingsProps,
) {
    const modalSettingsRef = useRef<HTMLDialogElement>(null);
    const [uuidListWordsSelected, _] = useState("6234"); //setUuidListWordsSelected
    const [metaWordLists, setMetaWordLists] = useState<
        { id: string; name: string }[]
    >([]);
    const [status, setStatus] = useState<string | null>(null);

    const addWordList = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const json = JSON.parse(text);

                if (isWordList(json)) {
                    await addList(json);
                    setStatus(`✅ Imported list: "${json.name}"`);
                    loadAllMeta();
                } else {
                    setStatus("❌ Invalid JSON structure");
                }
            } catch (err) {
                console.error(err);
                setStatus("❌ Failed to parse JSON (check log)");
            }
        };
        reader.readAsText(file);
    };

    const deleteWorldList = async (id: string) => {
        try {
            await deleteList(id);
            setStatus(`✅ List deleted`);
            loadAllMeta();
        } catch (err) {
            console.error(err);
            setStatus("❌ Failed to delete (check log)");
        }
    };

    const loadAllMeta = () => {
        getAllMeta()
            .then((r) => setMetaWordLists(r))
            .catch((e) => console.error(e));
    };

    useEffect(() => {
        loadAllMeta();
    }, []);

    return (
        <>
            <dialog ref={modalSettingsRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">Settings</h3>
                    <p className="py-4">
                        Select a list of words. You can also import a list of
                        words. Please refer to the{" "}
                        <a className="link link-info" href="github.com">
                            documentation
                        </a>{" "}
                        if you wish to import a list of words.
                    </p>

                    <ul className="h-72 overflow-y-scroll flex flex-wrap justify-center content-baseline gap-4 p-4 border-2 rounded-xl">
                        {metaWordLists.map((l) => (
                            <li
                                key={l.id}
                                className={`btn btn-lg w-full text-left pr-1 ${
                                    l.id === uuidListWordsSelected &&
                                    "btn-dash btn-primary"
                                }`}
                                onClick={() => onLoadWordList(l.id)}
                            >
                                <a className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
                                    {l.name} <b>#{l.id}</b>
                                </a>
                                <button
                                    className="btn btn-square btn-error"
                                    onClick={() => deleteWorldList(l.id)}
                                >
                                    <TrashIcon className="h-6 w-6" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    {status && <p className="mt-2">{status}</p>}

                    <div className="modal-action flex justify-between w-full mt-3">
                        <label
                            className="btn btn-primary"
                            htmlFor="loadFileDataWordList"
                        >
                            Import a list of words
                        </label>
                        <input
                            id="loadFileDataWordList"
                            className="file-input file-input-primary hidden"
                            type="file"
                            accept=".json"
                            onChange={addWordList}
                        />
                        <form method="dialog">
                            <button
                                className="btn"
                                onClick={() =>
                                    setTimeout(
                                        () => inputGuessRef?.current?.focus(),
                                        300,
                                    )}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>

            <button
                className="btn btn-square btn-ghost"
                onClick={() =>
                    modalSettingsRef.current &&
                    modalSettingsRef.current.showModal()}
            >
                <Cog6ToothIcon className="h-10 w-10" />
            </button>
        </>
    );
}
