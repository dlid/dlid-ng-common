import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectorExampleDatabindArrayPageComponent, SelectorPageComponent } from './pages';
import { ComponentsPageComponent } from './pages/components/components-page.components';
import { SelectorExamplePageComponent } from './pages/selector/examples/selector-examples.page.component';

const routes: Routes = [
  
  {
    path: 'components',
    component: ComponentsPageComponent
  },
  {
    path: 'components/selector',
    component: SelectorPageComponent
  },
  {
    path: 'components/selector/examples',
    component: SelectorExamplePageComponent
  },
  
  {
    path: 'components/selector/examples/databind-array',
    component: SelectorExampleDatabindArrayPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
