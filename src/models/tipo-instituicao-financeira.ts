export enum TipoInstituicaoFinanceiraEnum {
  BANCO = "BANCO",
  CORRETORA = "CORRETORA"
}

const labels: Record<TipoInstituicaoFinanceiraEnum, string> = {
  [TipoInstituicaoFinanceiraEnum.BANCO]: "Banco",
  [TipoInstituicaoFinanceiraEnum.CORRETORA]: "Corretora"
};

export function getLabel(tipo: TipoInstituicaoFinanceiraEnum): string {
  return labels[tipo];
}

export function getAllLabels(): string[] {
  return Object.values(labels);
}

export function getAllValues(): TipoInstituicaoFinanceiraEnum[] {
  return Object.values(TipoInstituicaoFinanceiraEnum) as TipoInstituicaoFinanceiraEnum[];
}

export function getAll(): { value: TipoInstituicaoFinanceiraEnum, label: string }[] {
  return Object.entries(labels).map(([value, label]) => ({ value: value as TipoInstituicaoFinanceiraEnum, label }));
}
