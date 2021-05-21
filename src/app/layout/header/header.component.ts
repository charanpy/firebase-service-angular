import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email=""
  constructor(
    private toastr:ToastrService,
    private auth: AuthService,
    private router: Router

  ) {
    auth.getUser().subscribe(user => {
      this.email=user?.email
    })
   }

  ngOnInit(): void {
  }

  async handleSignOut(){
    await this.auth.signOut()
    this.router.navigateByUrl('/signin')
    this.toastr.info("Please login again to get access")
    this.email=null;
  }

}
