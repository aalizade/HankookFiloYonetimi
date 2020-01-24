import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../authorization/authorization.service';
import { DataTablesComponentMessageService } from '../rxjs/data-tables-component-message.service';
import { ExtraInfoHelper } from '../../helpers/extra-info-helper/extra-info-helper';

@Injectable({
  providedIn: 'root'
})
export class DataTablesService {

  constructor(private http: HttpClient, private authorize: AuthorizationService, private settingService: SettingsService, private dataTablesRxJs: DataTablesComponentMessageService) { }
  dtOptions: DataTables.Settings = {};

  getData(URL: string = "", pageLength: number = 10, columnsData: any[] = [], extraInfo: ExtraInfoHelper = null) {
    const that = this;
    return this.dtOptions = {
      pagingType: 'full_numbers',
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        var tableIdentifier = (window.location.pathname).replace(/[- ._/]*/g, '');
        window.localStorage.setItem(tableIdentifier, JSON.stringify(data));
      },
      stateLoadCallback: function (settings) {
        var tableIdentifier = (window.location.pathname).replace(/[- ._/]*/g, '');
        return JSON.parse(window.localStorage.getItem(tableIdentifier));
      },
      pageLength: pageLength,
      serverSide: true,
      processing: true,
      searchDelay: 350,
      language: {
        "emptyTable": "Tabloda herhangi bir veri mevcut değil",
        "info": "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
        "infoEmpty": "Kayıt yok",
        "infoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
        "infoPostFix": "",
        "lengthMenu": "Sayfada _MENU_ kayıt göster",
        "loadingRecords": "Yükleniyor...",
        "processing": "İşleniyor...",
        "search": "Ara:",
        "zeroRecords": "Eşleşen kayıt bulunamadı",
        "paginate": {
          "first": "İlk",
          "last": "Son",
          "next": "Sonraki",
          "previous": "Önceki"
        },
        "aria": {
          "sortAscending": ": artan sütun sıralamasını aktifleştir",
          "sortDescending": ": azalan sütun sıralamasını aktifleştir"
        },
        "searchPlaceholder": "arama yapın.."
      },
      ajax: (dataTablesParameters: any, callback) => {
        if (extraInfo != null) {
          var extraInfoArray = [];
          extraInfoArray.push(extraInfo);
          extraInfoArray.forEach(function (data, index) {
            var keys = Object.keys(data);
            var keyForObject = keys[index];
            dataTablesParameters[keyForObject] = data[keyForObject]
          });
        }
        that.http.post<DataTablesResponse>(this.settingService.siteAddressBack + URL, dataTablesParameters, { headers: this.authorize._header })
          .subscribe(resp => {
            this.dataTablesRxJs.dataTablesSetData(URL, resp.data)
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          }, err => console.log(err));
      },
      // columns: [{ data: 'EbatID' }, { data: 'Ad' }, { data: 'Aktif' }]
      columns: columnsData
    };

  }
}

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
