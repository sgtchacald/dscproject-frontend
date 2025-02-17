export class Receita {
  id: number | null;
  nome: string | undefined | null;
  descricao: string | undefined | null;
  valor: number | undefined | null;
  tipoRegistroFinanceiro: string | undefined | null;
  categoriaRegistroFinanceiro: string | undefined | null;
  instituicaoFinanceiraUsuarioId: number | undefined | null;
  instituicaoFinanceiraId: number | undefined | null;

  constructor(
    id: number | null = null,
    nome: string | undefined | null = null,
    descricao: string | undefined | null = null,
    valor: number | undefined | null = null,
    tipoRegistroFinanceiro: string | undefined | null = null,
    categoriaRegistroFinanceiro: string | undefined | null = null,
    instituicaoFinanceiraUsuarioId: number | undefined | null = null,
    instituicaoFinanceiraId: number | undefined | null = null,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.valor = valor;
    this.tipoRegistroFinanceiro = tipoRegistroFinanceiro;
    this.categoriaRegistroFinanceiro = categoriaRegistroFinanceiro;
    this.instituicaoFinanceiraUsuarioId = instituicaoFinanceiraUsuarioId;
    this.instituicaoFinanceiraId = instituicaoFinanceiraId;
  }
}
