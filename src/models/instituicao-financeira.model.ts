export class InstituicaoFinanceira {
  id: number | null;
  nome: string;
  tipoInstituicao: string | undefined;
  disabled: boolean;

  constructor(id: number | null, nome: string, tipoInstituicao: string, disabled: boolean) {
    this.id = id;
    this.nome = nome;
    this.tipoInstituicao = tipoInstituicao;
    this.disabled = disabled;
  }
}
