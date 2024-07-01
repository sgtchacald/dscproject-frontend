import { FormGroup } from "@angular/forms";

export function senhaERepitaASenhaDiferentes(formGroup: FormGroup){
  const senha = formGroup.get('senha')?.value ?? '';
  const repitaSenha = formGroup.get('repitaSenha')?.value ?? '';
  return  (senha != "" && repitaSenha != "") && (senha != repitaSenha) ? { senhaERepitaASenhaDiferentes: true} : null;
}
