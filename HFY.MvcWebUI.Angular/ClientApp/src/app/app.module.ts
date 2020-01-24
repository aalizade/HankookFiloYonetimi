import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SettingsService } from './lazy-general-page/services/settings/settings.service';
import { AuthorizationService } from './lazy-general-page/services/authorization/authorization.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from './lazy-general-page/services/extra-services/toastr.service';
import { SweetAlertService } from './lazy-general-page/services/extra-services/sweet-alert.service';
import { DataTablesComponentMessageService } from './lazy-general-page/services/rxjs/data-tables-component-message.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [SettingsService, AuthorizationService, DatePipe, DataTablesComponentMessageService, ToastrService, SweetAlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
