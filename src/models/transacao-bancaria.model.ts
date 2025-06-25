import {Usuario} from "./usuario.model";

export class TransacaoBancaria {

  id: number | null;
  descricao: string | undefined | null;
  valor: number | undefined | null;
  dtLancamento: string | undefined | null | Date;
  ofxTransacaoId: string | undefined | null;
  tipoRegistroFinanceiro: string | undefined | null;
  categoriaRegistroFinanceiro: string | undefined | null;
  instituicaoFinanceiraUsuarioId: string | undefined | null;
  codigoBanco: string | undefined | null;

  constructor(
    id: number | null = null,
    descricao: string | undefined | null = null,
    valor: number | undefined | null = null,
    dtLancamento: string | undefined | null = null,
    ofxTransacaoId: string | undefined | null = null,
    tipoRegistroFinanceiro: string | undefined | null = null,
    categoriaRegistroFinanceiro: string | undefined | null = null,
    instituicaoFinanceiraUsuarioId: string | undefined | null = null,
    codigoBanco: string | undefined | null = null
  ) {
    this.id = id;
    this.descricao = descricao;
    this.valor = valor;
    this.dtLancamento = dtLancamento;
    this.ofxTransacaoId = ofxTransacaoId;
    this.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.categoriaRegistroFinanceiro = categoriaRegistroFinanceiro;
    this.instituicaoFinanceiraUsuarioId = instituicaoFinanceiraUsuarioId;
    this.codigoBanco = codigoBanco;
  }
}
