import * as Yup from "yup";

export interface RegionDivisionConfig {
    newRegionDivision: string;
    regionDivisionOption: string,
    version: string;
    branch?: "Strom" | "Gas" | "",
    client?: "Privat" | "Gewerbe" | "";
}

export interface List{
    id:number;
    placeList: Place[];
    listInfo: {
        listName: string;
        listDetails: string;
    }
}

export interface ListHinzufugen {
    listName: string;
    listDetails: string;
    searchTerm: string;
}

export interface Place {
    postcode: string;
    placeName: string;
    isValid?:boolean;
    id?: symbol;
}

export interface RegionForm {
    mode: "edit" | "create" | "copy" | "";
    regionDivisionConfig: RegionDivisionConfig;
    listHinzufugen: ListHinzufugen;
    restmenge: string;
    list: List[] | null;
}

export const initialValuesRegionForm: RegionForm = {
    mode: "",
    regionDivisionConfig: {
        newRegionDivision: "",
        regionDivisionOption: "",
        version: "",
        branch: "",
        client: "",
    },
    listHinzufugen: {
        listName: "",
        listDetails: "",
        searchTerm: "",
    },
    restmenge: "Germany",
    list: null,
};

export const germanRegex = /^[A-Za-zäöüÄÖÜß\s,.\-/]+$/;

const germanLettersOnly = Yup.string().test(
    "german-letters-only",
    "only german letters are allowed",
    function(value){
        if(!value) return true;
        // const germanRegex = /^[A-Za-zäöüÄÖÜß\s,.\-/]+$/;
        return germanRegex.test(value);
    }
);

export const validationSchemaSPFRegionForm = Yup.object().shape({
    regionDivisionConfig: Yup.object().shape({
        newRegionDivision: Yup.string().optional(),
        regionDivisionOption: Yup.string().required("Required"),
        version: Yup.number().required("Required"),
        branch: Yup.string().required("Required"),
        client: Yup.string().required("Required"),
    }),
    listHinzufugen: Yup.object().shape({
        listName: Yup.string().optional(),
        listDetails: Yup.string().optional(),
        searchTerm: Yup.string()
            .optional(),
    }),
    restmenge: Yup.string().optional(),
    list: Yup.array().required("Required").of(Yup.object().shape({
        placeList: Yup.array().required().of(Yup.object().shape({
            postcode: Yup.string().required("Required"),
            placeName: germanLettersOnly.required("Required"),
        })),
        listInfo: Yup.object().shape({
            listName: Yup.string().required("Required"),
            listDetails: Yup.string().required("Required"),
        }),
        id:Yup.number().required("Required"),
    }))
})