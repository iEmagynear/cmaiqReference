import { TestBed } from '@angular/core/testing';

import { SharedMlsService } from './shared-mls.service';

describe('SharedMlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedMlsService = TestBed.get(SharedMlsService);
    expect(service).toBeTruthy();
  });
});
