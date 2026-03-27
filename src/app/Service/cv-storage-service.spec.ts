import { TestBed } from '@angular/core/testing';

import { CvStorageService } from './cv-storage-service';

describe('CvStorageService', () => {
  let service: CvStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
