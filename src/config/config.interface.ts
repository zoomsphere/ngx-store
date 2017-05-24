export interface WebStorageConfigInterface {
    prefix?: string;
    clearType?: ClearType;
    mutateObjects?: boolean;
}
export type ClearType = 'decorators' | 'prefix' | 'all';
