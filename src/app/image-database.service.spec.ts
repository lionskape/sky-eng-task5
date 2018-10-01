import { TestBed } from '@angular/core/testing';

import { ImageDatabaseService } from './image-database.service';

describe('ImageDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageDatabaseService = TestBed.get(ImageDatabaseService);
    expect(service).toBeTruthy();
  });
});
