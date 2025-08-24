import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {CommandModule} from '@angular/cli/src/command-builder/command-module';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-verify-token',
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-token.component.html',
  styleUrl: './verify-token.component.scss'
})
export class VerifyTokenComponent implements OnInit{
   statusMessage = "";
   loading = true ;

   constructor(private service :AuthService ,
               private route : ActivatedRoute,
                private router : Router) {

   }

  ngOnInit(): void {
        const token = this.route.snapshot.paramMap.get('token');
      if (token) {
      this.service.verifyToken(token).subscribe({
        next: () => {
          this.statusMessage = 'Token verified successfully!';
          this.loading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },

        error: () => {
          this.statusMessage = 'Invalid or expired token.';
          this.loading = false;
        }
      });
    } else {
      this.statusMessage = 'No token provided.';
      this.loading = false;
    }
   }


}
