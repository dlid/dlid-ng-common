import { Observable, Subject } from 'rxjs';

/***
 * The data source interface that is used to bind
 * components with different types of data
 */
export interface DataSource<T> {
    data$: Observable<T>;
    refresh: (options: DataSourceRequest) => void;
    destroy: () => void;
}

/**
 * The request with options sent when the datasource
 * needs to be refreshed
 * This can contain filtering options etc depending on
 * component
 */
export interface DataSourceRequest {
    query?: string;
    take?: number;
    skip?: number;
    params: { [key: string]: any};
}

export interface DataSourceBinding<T> {
    fetch: DataSourceFetchFunction<T>;
    dataSource: DataSource<T>;
    subject: Subject<T>;
}

export type DataSourceFetchFunction<T> = (options: DataSourceRequest) => Observable<T>;



