import { Component, Input } from '@angular/core';

export interface ExampleFile {
    filename: string;
    code: string;
    languages?: string[];
}

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./eample.component.scss']
})
export class ExampleComponent {

    items?: ExampleFile[];
    activeTab?: string;

    selectFile(file: ExampleFile | null, e: Event) {
        e.preventDefault();
        
        if (file) {
            this.activeTab = file.filename;
        } else {
            this.activeTab = '';
        }
    }

    @Input() 
    set files(files: ExampleFile[]) {
        this.items = files?.map(x => {
            if (!x.languages) {
                x.languages = [];
                if (x.filename) {
                    const extension = x.filename.replace(/^.*\.(.+)$/, '$1');
                    if (extension) {
                        x.languages = [extension];
                    }
                }
            }
            return x;
        });
    }

}
