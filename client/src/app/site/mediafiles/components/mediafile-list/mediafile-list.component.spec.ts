import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediafileListComponent } from './mediafile-list.component';
import { E2EImportsModule } from 'e2e-imports.module';

describe('MediafileListComponent', () => {
    let component: MediafileListComponent;
    let fixture: ComponentFixture<MediafileListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [E2EImportsModule],
            declarations: [MediafileListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediafileListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
