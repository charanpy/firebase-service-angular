import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service' 
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators'
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from "@angular/fire/database";
import { readAndCompressImage } from 'browser-image-resizer'
import { imageConfig } from 'src/utils/config'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  picture=""
  uploadPercent: number = 0
  constructor(
    private auth:AuthService,
    private router:Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    const { email, password,username,country,bio,name} = f.form.value;
    this.auth.signup(email,password)
    .then(res => {
      console.log(res);
      const {uid} = res.user;
      this.db.object(`/users/${uid}`).set({
        id:uid,
        name,email,instaUsername:username,country,bio,picture: 'htt'
      })
    })
    .then(() => {
      this.router.navigateByUrl('/');
      this.toastr.success('Signup success')
    })
    .catch(err=> console.log(err))
  }

  async uploadFile(event){
    const file=event.target.files[0];
    let rezizedImage = await readAndCompressImage(file,imageConfig)

    const filePath=file.name
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath,rezizedImage);
    task.percentageChanges().subscribe(percentage => {
      this.uploadPercent = percentage
    })
    task.snapshotChanges().pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe(url => {
        this.picture = url;
        this.toastr.success('image upload success')
      })
    })).subscribe()
  }

}
