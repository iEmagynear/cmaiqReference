import { TestBed } from '@angular/core/testing';

import { MlsService } from './mls.service';

describe('MlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MlsService = TestBed.get(MlsService);
    expect(service).toBeTruthy();
  });
});
