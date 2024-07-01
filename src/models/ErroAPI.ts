interface ErroAPI {
  timestamp: number;
  status: number;
  error: string;
  path: string;
  errors?: ErroDetalhado[];
}
