import {Usuario} from "./usuario.model";

export class Despesa {
  id: number | null;
  competencia: string | undefined | null;
  nome: string | undefined | null;
  descricao: string | undefined | null;
  valor: number | undefined | null;
  dtVencimento: string | undefined | null | Date;
  existeParcela: boolean | undefined | null;
  idParcelaPai: number | undefined | null;
  nrParcela: number | undefined | null;
  qtdParcela: number | undefined | null;
  valorParcelado: number | undefined | null;
  tipoRegistroFinanceiro: string | undefined | null;
  categoriaRegistroFinanceiro: string | undefined | null;
  statusPagamento:  string | undefined | null;
  instituicaoFinanceiraUsuarioId: number | undefined | null;
  instituicaoFinanceiraId: number | undefined | null;
  usuariosResponsaveis: Usuario[];

  constructor(
    id: number | null = null,
    competencia: string | undefined | null = null,
    nome: string | undefined | null = null,
    descricao: string | undefined | null = null,
    valor: number | undefined | null = null,
    dtVencimento: string | undefined | null = null,
    existeParcela: boolean | undefined | null = null,
    idParcelaPai: number | undefined | null = null,
    nrParcela: number | undefined | null = null,
    qtdParcela: number | undefined | null = null,
    valorParcelado: number | undefined | null = null,
    tipoRegistroFinanceiro: string | undefined | null = null,
    categoriaRegistroFinanceiro: string | undefined | null = null,
    statusPagamento: string | undefined | null = null,
    instituicaoFinanceiraUsuarioId: number | undefined | null = null,
    instituicaoFinanceiraId: number | undefined | null = null,
    usuariosResponsaveis: Usuario[] = []
  ) {
    this.id = id;
    this.competencia = competencia;
    this.nome = nome;
    this.descricao = descricao;
    this.valor = valor;
    this.dtVencimento = dtVencimento;
    this.existeParcela = existeParcela;
    this.idParcelaPai = idParcelaPai;
    this.nrParcela = nrParcela;
    this.qtdParcela = qtdParcela;
    this.valorParcelado = valorParcelado;
    this.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.categoriaRegistroFinanceiro = categoriaRegistroFinanceiro;
    this.statusPagamento = statusPagamento;
    this.instituicaoFinanceiraUsuarioId = instituicaoFinanceiraUsuarioId;
    this.instituicaoFinanceiraId = instituicaoFinanceiraId;
    this.usuariosResponsaveis = usuariosResponsaveis;
  }
}
