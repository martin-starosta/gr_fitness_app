import path from "path";
import { I18n } from "i18n";

const i18n = new I18n({
    locales: ["en", "sk"],
    defaultLocale: "en",
    header: "language", // preferred language by the client
    directory: path.join("src", "locales"),
});

export default i18n;
