import { FileEditor } from "../components/file_editor/component";
import { Page } from "./layouts/Page";

export default class Home extends Page {
    content() {
        return <FileEditor />;
    }
}
