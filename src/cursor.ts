export interface Cursor {
    readonly buffer: Buffer;
    readonly segment: number;
    readonly offset: number;
}