import "./textAreaWrapper.css";
import {useField, useFormikContext} from "formik";
import {RegionForm} from "../../../forms/addRegion/regionFormConfig";
import {useTranslation} from "react-i18next";

interface Props {
    name: string;
}

const TextAreaWrapper: React.FC<Props> = ({name}) => {

    const [field, meta] = useField(name);

    const {t} = useTranslation();

    const {values: {mode}} = useFormikContext<RegionForm>()

    return (
        <div className="text-area-wrapper">
            <textarea
                className={`${(meta.touched && meta.error) && "hightlight"}`}
                placeholder={t("enterDescription")}
                {...field}
                // disabled={mode === "view" ? true : false}
            />
            {meta.touched && meta.error ? (
                <div className="error">
                    <div className="error-msg">{meta.error}</div>
                </div>
            ) : null}
        </div>
    );
};
export default TextAreaWrapper;
