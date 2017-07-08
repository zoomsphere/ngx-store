export interface WebStorageConfigInterface {
    prefix?: string;
    previousPrefix?: string;
    clearType?: ClearType;
    mutateObjects?: boolean;
    cookiesScope?: string;
    debugMode?: boolean;
}
export type ClearType = 'decorators' | 'prefix' | 'all';
