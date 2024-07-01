import { FormGroup } from "@angular/forms";

export function usuarioESenhaIguaisValidator(formGroup: FormGroup){
  const login = formGroup.get('login')?.value ?? '';
  const senha = formGroup.get('senha')?.value ?? '';
  return  (login.trim() + senha.trim()) && (login === senha) ? { usuarioESenhaIguais: true} : null;
}
