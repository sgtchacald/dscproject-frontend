export class RegistroFinanceiro {
  id: number | null;
  descricao: string | undefined | null;
  valor: number | undefined | null;
  dtVencimento: string | undefined | null;
  diaVencimento: number | undefined | null;
  qtdParcela: number | undefined | null;
  tipoRegistroFinanceiro: string | undefined | null;
  tipoReceitaDespesa: string | undefined | null;
  statusPagamento: {key: string, value: string} | undefined | null;
  instituicaoFinanceiraUsuarioId: number | undefined | null;
  usuariosResponsaveis: number[] = [];
  
  constructor(id: number | null, descricao: string | undefined | null, valor: number | undefined | null, dtVencimento: string | undefined | null, diaVencimento: number | undefined | null, qtdParcela: number | undefined | null, tipoRegistroFinanceiro: string | undefined | null, tipoReceitaDespesa: string | undefined | null, statusPagamento: {
    key: string;
    value: string
  } | undefined | null, instituicaoFinanceiraUsuarioId: number | undefined | null, usuariosResponsaveis: number[]) {
    this.id = id;
    this.descricao = descricao;
    this.valor = valor;
    this.dtVencimento = dtVencimento;
    this.diaVencimento = diaVencimento;
    this.qtdParcela = qtdParcela;
    this.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.tipoReceitaDespesa = tipoReceitaDespesa;
    this.statusPagamento = statusPagamento;
    this.instituicaoFinanceiraUsuarioId = instituicaoFinanceiraUsuarioId;
    this.usuariosResponsaveis = usuariosResponsaveis;
  }
}
