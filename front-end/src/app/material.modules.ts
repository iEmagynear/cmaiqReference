import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
    imports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatDialogModule,
        MatSliderModule
    ],
    exports: [
        MatProgressSpinnerModule,
        MatCardModule,
        MatDialogModule,
        MatSliderModule
    ]
})
export class MaterialModule {}
