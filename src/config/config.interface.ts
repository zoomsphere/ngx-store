export interface WebStorageConfigInterface {
    prefix?: string;
    previousPrefix?: string;
    clearType?: ClearType;
    mutateObjects?: boolean;
    debugMode?: boolean;
}
export type ClearType = 'decorators' | 'prefix' | 'all';
