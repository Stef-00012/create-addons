export function compareArrays<T>(a: T[], b: T[]): boolean {
    return a.length === b.length && a.every((value) => b.includes(value));
}