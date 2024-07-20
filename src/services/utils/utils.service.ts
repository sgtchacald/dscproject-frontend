import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  substituiVariaveis(message: string, variables: { [key: string]: any }): string {
    return message.replace(/{(\w+)}/g, (_, key) => variables[key] || '');
  }
}
