import {InstituicaoFinanceira} from "./instituicao-financeira.model";

// @ts-ignore
export class InstituicaoFinanceiraUsuario {
  id: number | null;
  agencia: string | undefined;
  conta: string | undefined;
  nomeGerente: string | undefined;
  telefoneGerente: string | undefined;

  instituicaoFinanceira: InstituicaoFinanceira | undefined | null;

  constructor(id: number | null, agencia: string | undefined, conta: string | undefined, nomeGerente: string | undefined, telefoneGerente: string | undefined, instituicaoFinanceira: null | undefined) {
    this.id = id;
    this.agencia = agencia;
    this.conta = conta;
    this.nomeGerente = nomeGerente;
    this.telefoneGerente = telefoneGerente;
    this.instituicaoFinanceira = instituicaoFinanceira;
  }

}
