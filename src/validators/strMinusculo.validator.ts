import { AbstractControl } from "@angular/forms";

export function strMinusculoValidator(control: AbstractControl){

  const valor = control.value as string;

  if(valor !== valor.toLowerCase()){
    return { minusculo: true}
  }

  return null;
}
