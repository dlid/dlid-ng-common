import { Component } from '@angular/core';

@Component({
    templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent {
    code = `<dlid-selector></dlid-selector>`;
    code2 = `import { SelectorOption } from '@dlid/ng-common';

@Component(...);
export class ExampleComponent implements OnInit {

 data: SelectorOptions[] = [];

 ngOnInit(): void {

  // Simple data binding to an array of items
  this.data = [
   {text: 'First option', value: 'first'},
   {text: 'Second option', value: '2nd'}
  ];

 }
}`;
}