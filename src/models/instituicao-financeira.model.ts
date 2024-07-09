export class InstituicaoFinanceira {
  id: number | null;
  nome: string;
  tipoInstituicao: string | undefined;

  constructor(id: number | null, nome: string, tipoInstituicao: string) {
    this.id = id;
    this.nome = nome;
    this.tipoInstituicao = tipoInstituicao;
  }
}
