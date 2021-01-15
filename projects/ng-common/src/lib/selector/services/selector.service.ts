import { Injectable } from '@angular/core';
import { DataSource, DataSourceFetchFunction } from '../../datasource';
import { DataSourceService } from '../../datasource/datasource.service';
import { SelectorData} from '../components/selector.component';

export interface SelectorSettings {
  blockClassName: string; 
}

@Injectable({
  providedIn: 'root'
})
export class SelectorService {

  private defaultValues: SelectorSettings = {
    blockClassName: 'dlid-selector'
  }


  public get defaults(): SelectorSettings {
    return this.defaultValues;
  }

  constructor(private dataSourceService: DataSourceService) { }

  public setDefaults(defaults: { blockClassName: string }): void {
    this.defaultValues = Object.assign(this.defaultValues, defaults);
  }

  /**
   * Create a DataSource with a callback function to bind to the Selector
   * @param fetchFunction The function to retreive the selector options
   */
  public bind(fetchFunction: DataSourceFetchFunction<SelectorData>): DataSource<SelectorData> {
    return this.dataSourceService.create<SelectorData>(fetchFunction);
  }

}
