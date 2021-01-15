import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectorExampleDatabindArrayPageComponent, SelectorPageComponent } from './pages';
import { DlidSelectorComponent } from '@dlid/ng-common';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ExampleComponent } from './components/example/example.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { ComponentsPageComponent } from './pages/components/components-page.components';
import { SelectorExamplePageComponent } from './pages/selector/examples/selector-examples.page.component';

@NgModule({
  declarations: [
    AppComponent,

    SelectorPageComponent,
    DlidSelectorComponent,
    ExampleComponent,
    NavigationComponent,
    SelectorExampleDatabindArrayPageComponent,
    SelectorExamplePageComponent,
    ComponentsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighlightModule,
    FormsModule 
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
