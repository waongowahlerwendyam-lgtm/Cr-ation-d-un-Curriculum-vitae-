import { TestBed } from '@angular/core/testing';

import { CvPreviewService } from './cv-preview.service';

describe('CvPreviewService', () => {
  let service: CvPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
