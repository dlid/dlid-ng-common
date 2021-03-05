import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { 
    DataSource, 
    DataSourceBinding, 
    DataSourceFetchFunction,
    DataSourceRequest 
} from './datasource.types';

@Injectable({
    providedIn: 'root'
})
export class DataSourceService {

    private incrementalId = 0;
    private bindings: { [key: string]: DataSourceBinding<any> } = {};

    public create<T>(fetchFunction: DataSourceFetchFunction<T>): DataSource<T> {
        const id = `binding${this.incrementalId}`;
        const sub = new Subject<T>();
        this.incrementalId++;
        this.bindings[id] = {
            fetch: fetchFunction,
            dataSource: {
                data$: sub.asObservable(),
                refresh: request => this.refreshData(id, request),
                destroy: () => {

                }
            },
            subject: sub
        }

        return this.bindings[id].dataSource;
    }

    private refreshData(bindingId: string, request: DataSourceRequest): void {
        const binding = this.bindings[bindingId];
        binding.fetch(request).subscribe(
            response => binding.subject.next(response),
            error => {
                console.error("FEL", error);
            }
        )
    }

}