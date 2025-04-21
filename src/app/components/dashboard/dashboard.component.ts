import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
searchText: string = '';
onSearchChange() {}
clearSearch() {
  this.searchText = '';
  }
  isSidebarOpen = true;
  navItems = [
    { icon: 'lightbulb', label: 'Notes' },
    { icon: 'notifications', label: 'Reminders' },
    { icon: 'edit', label: 'Edit Labels' },
    { icon: 'archive', label: 'Archive' },
    { icon: 'delete', label: 'Bin' }
  ];
showTooltip: any;
userEmail: any;
userFirstName: any;
userLastName: any;

  constructor(private router: Router){}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  // Add any other methods or properties you need for the dashboard component
  // For example, you might want to fetch user data or notes here
  // constructor(private userSer: UserService) {}
  // ngOnInit(): void {
  //   this.userSer.getUserData().subscribe(
  //     (response) => {
  //       console.log('User data:', response);
  //     },
  //     (error) => {
  //       console.error('Error fetching user data:', error);
  //     }
  //   );
  // }
  // }
  //   this.snackBar.open('Please fill in all required fields.', 'Close', {
  //     duration: 3000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top'
  //   });
  //   }
}
