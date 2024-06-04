import { Identifiable } from "./IUser";

/**
 * Interface for Asana metadata
 * @interface IAsanaMetaData
 * @description Interface for Asana metadata
 * @property {string} name - Name of the asana
 * @property {string} description - Description of the asana
 * @property {string[]} keywords - Keywords for the asana
 * @property {IAsanas[]} counterPoses - Counter poses for the asana
 * @property {string[]} benefits - Benefits of the asana
 */
interface IAsanaMetaData {
    name: string;
    description: string;
    keywords: string[];
    counterPoses: IAsanas[];
    benefits: string[];
}

/**
 * Interface for Asanas
 * @interface IAsanas
 * @extends Identifiable
 * @description Interface for Asanas with metadata
 * @property {IAsanaMetaData} metaData - Metadata for the asana
 * @property {string} videoUrl - URL for the asana video
 */
export interface IAsanas extends Identifiable {
    metaData: IAsanaMetaData;
    videoUrl: string;
}