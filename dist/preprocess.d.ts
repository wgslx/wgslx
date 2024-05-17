interface TemplateList {
    startPosition: number;
    endPosition: number;
}
export declare function preprocess(text: string): string;
export declare function discoverComments(text: string): void;
export declare function discoverTemplates(text: string): TemplateList[];
export {};
