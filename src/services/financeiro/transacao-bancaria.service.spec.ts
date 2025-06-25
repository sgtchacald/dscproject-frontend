import { TestBed } from '@angular/core/testing';

import { TransacaoBancariaService } from './transacao-bancaria.service';

describe('TransacaoBancariaService', () => {
  let service: TransacaoBancariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransacaoBancariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
