import { Component, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { HomeService } from '../../services/home.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';

const IMAGE_PREVIEW: string = './assets/images/user_profile_square.png';
@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  currentUser = computed(() => this.authService.currentUser());
  // imagePreview = computed(() => this.currentUser()?.profile.photo || IMAGE_PREVIEW);
  imagePreview!: string;
  settingsForm!: FormGroup;
  photo?: File;
  loading: boolean = false;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder, 
    private validatorsService: ValidatorsService,
    private homeService: HomeService,
    private alertsService: AlertsService,
  ) {}
  
  ngOnInit(): void {
    this.loadImagePreview();
    const gender = this.currentUser()?.profile.gender;
    
    this.settingsForm = this.fb.group({
      file: [null, [Validators.required]],
      gender: [gender],
    });
  }
  
  loadImagePreview(): void {
    this.imagePreview = this.currentUser()?.profile.photo || IMAGE_PREVIEW;
  }
  
  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    
    const id = this.currentUser()?.profile.id;
    const {gender} = this.settingsForm.value;
    if (!id && !this.photo) return;
    
    this.loading = true; // Habilitar estado de carga
    
    this.homeService.uploadProfile(id!, this.photo!, gender).subscribe({
      next: (resp) => {
        this.alertsService.alertSuccess('Perfil actualizado correctamente');
        this.loading = false; 
        this.authService.getUser().subscribe({
          next: (user) => {
            this.imagePreview = user.profile.photo;
          }
        });
      },
      error: (err) => {
        // console.log(err);
        this.alertsService.alertError('Error al actualizar el perfil');
        this.loading = false;
      }
    });

  }
  
  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      this.photo = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
    }
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.settingsForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.settingsForm, field);
  }
  
}
