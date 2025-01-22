export class RegistroFinanceiro {
  id: number | null;
  descricao: string | undefined | null;
  valor: number | undefined | null;
  dtCadastro: string | undefined | null;
  dtVencimento: string | undefined | null;
  diaVencimento: string | undefined | null;
  qtdParcela: number | undefined | null;
  tipoRegistroFinanceiro: string | undefined | null;
  categoriaRegistroFinanceiro: string | undefined | null;
  statusPagamento:  string | undefined | null;
  instituicaoFinanceiraUsuarioId: number | undefined | null;
  usuariosResponsaveis: number[];

  constructor(
    id: number | null = null,
    descricao: string | undefined | null = null,
    valor: number | undefined | null = null,
    dtCadastro: string | undefined | null = null,
    dtVencimento: string | undefined | null = null,
    diaVencimento: string | undefined | null = null,
    qtdParcela: number | undefined | null = null,
    tipoRegistroFinanceiro: string | undefined | null = null,
    categoriaRegistroFinanceiro: string | undefined | null = null,
    statusPagamento: string | undefined | null = null,
    instituicaoFinanceiraUsuarioId: number | undefined | null = null,
    usuariosResponsaveis: number[] = []
  ) {
    this.id = id;
    this.descricao = descricao;
    this.valor = valor;
    this.dtCadastro = dtCadastro;
    this.dtVencimento = dtVencimento;
    this.diaVencimento = diaVencimento;
    this.qtdParcela = qtdParcela;
    this.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.categoriaRegistroFinanceiro = categoriaRegistroFinanceiro;
    this.statusPagamento = statusPagamento;
    this.instituicaoFinanceiraUsuarioId = instituicaoFinanceiraUsuarioId;
    this.usuariosResponsaveis = usuariosResponsaveis;
  }
}
