import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  constructor(private  http: HttpClient) {}

  getGenero() {
    return [
      { valor: 'FEMININO', desc: 'Feminino' },
      { valor: 'MASCULINO', desc: 'Masculino' },
      { valor: 'OUTRO', desc: 'Outro' }
    ];
  }
}
