export class InstituicaoFinanceira {
  id: number | null;
  nome: string;
  codigo: string | null;
  tipoInstituicao: string | undefined;
  disabled: boolean;

  constructor(id: number | null, nome: string, codigo: string, tipoInstituicao: string, disabled: boolean) {
    this.id = id;
    this.nome = nome;
    this.codigo = codigo;
    this.tipoInstituicao = tipoInstituicao;
    this.disabled = disabled;
  }
}
