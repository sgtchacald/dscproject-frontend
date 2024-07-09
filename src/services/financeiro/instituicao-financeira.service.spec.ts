import { TestBed } from '@angular/core/testing';

import { InstituicaoFinanceiraService } from './instituicao-financeira.service';

describe('InstituicaoFinanceiraService', () => {
  let service: InstituicaoFinanceiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituicaoFinanceiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
