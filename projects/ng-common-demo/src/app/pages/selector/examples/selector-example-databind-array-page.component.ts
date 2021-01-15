import { Component, OnInit } from '@angular/core';
import { SelectorOption } from '@dlid/ng-common';
import { ExampleFile } from '../../../components/example/example.component';

@Component({
    template: `

    <h1>Selector / DataBind Array</h1>
    <p>The simplest kind of binding using an array.</p>

    <app-example [files]="files">
        <dlid-selector [dataSource]="items" [(ngModel)]="test" placeholder="Please select your favorite cheese"></dlid-selector>
        {{ test | json }}
        <button>Submit</button>
    </app-example>


    <h2>Step by step</h2>
    <ol>
        <li><strong>Define</strong> a variable array of <code>SelectorOption</code> items in your component</li>
        <li><strong>Pass the array</strong> to the <code>[dataSource]</code> @Input of the component</li>
    </ol>

 
    <h2>Good to know</h2>

    <ul>
        <li>The Selector component will internally bind the array so the list is filterable on the <code>text</code> value.</li>
    </ul>


    `
})
export class SelectorExampleDatabindArrayPageComponent implements OnInit {
    items?: SelectorOption[];
    test?: SelectorOption;
    files: ExampleFile[] = [
        {
            filename: 'a.component.ts',
            code: `import { Component, OnInit } from '@angular/core';
import { SelectorOption } from '@dlid/ng-common';

@Component({
    template: \`<dlid-selector [dataSource]="items"></dlid-selector>\`
})
export class AComponent implements OnInit {

    // Define the variable
    items?: SelectorOption[];

    ngOnInit(): void {
        // Assign the items
        this.items = [
            { text: 'Brie', value: 'brie' },
            { text: 'Camembert', value: 'camembert'},
            { text: 'Cheddar', value: 'cheddar'},
        ]
    }

}`
        }
    ];

    ngOnInit(): void {
        this.items = [
            
            { text: 'Brie', value: 'brie' },
            { text: 'Camembert', value: 'camembert'},
            { text: 'Cheddar', value: 'cheddar'},
            { text: 'Nakenost', value: 'nost'},
            { text: 'Rastapopulus', value: 'rastap'},
            { text: 'Nakenost 2', value: 'nost2'},
            { text: 'Villfarelse', value: 'nostx'},
            { text: 'Realobana', value: 'real'},
            
            
        ]
    }

}
