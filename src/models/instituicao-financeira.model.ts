import { TipoInstituicaoFinanceiraEnum } from './tipo-instituicao-financeira'; // Ajuste o caminho conforme necessário

export class InstituicaoFinanceira {
  id: number | null;
  nome: string;
  tipoInstituicao: string;

  constructor(id: number | null, nome: string, tipoInstituicao: string) {
    this.id = id;
    this.nome = nome;
    this.tipoInstituicao = tipoInstituicao;
  }
}
