//angular
import {Component, OnInit, OnDestroy} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, NavigationError} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HeaderComponent} from "./common/header/header.component";
import {RunTestComponent} from "./user/runTest/runTest.component";
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {TeacherComponent} from "./teacher/teacher.component";
import {FinishTestPageComponent} from "./user/runTest/finish.page.component";
import {TeacherCheckingComponent} from "./teacher/teacher-checking.component";
import {ChartsComponent} from "./user/charts/charts.component";
import {ShowTestsComponent} from "./user/ShowTests/showTests.component";
import {DatepickerComponent} from "./admin/actions/show-users/user-info/datepicker.component";
import {ShowUsersComponent} from "./admin/actions/show-users/show-users.component";
import {AssignTestComponent} from "./admin/actions/show-users/user-info/assign-test.component";
import {TeacherInfoComponent} from "./admin/actions/show-users/teacher-info/teacher-info.component";
import {Constants} from "./common/constants/constants.data";
import {AuthService} from "./common/auth/auth.service";
import {Subscription} from "rxjs/Rx";
import {GUID} from "./common/guid/GUID";
import {GuestInfoComponent} from "./admin/actions/show-users/guest-info/guest-info.component";

import $ from "jquery";
//components

//others



@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES, HeaderComponent],
    precompile: [
        LoginComponent,
        UserComponent,
        AdminComponent,
        TeacherComponent,
        AssignTestComponent,
        TeacherInfoComponent,
        DatepickerComponent,
        RunTestComponent,
        FinishTestPageComponent,
        TeacherCheckingComponent,
        ChartsComponent,
        ShowTestsComponent,
        ShowUsersComponent,
        GuestInfoComponent
    ],
    providers: [Location]
})

export class AppComponent implements OnInit, OnDestroy {
    // TODO: (pay attention) 'sub' says nothing use clear names for variable
    private routeChangeSubscription:Subscription;

    constructor(private authService:AuthService,
                private router:Router,
                private constants:Constants) {
    }

    checkPath():boolean {
        let pathname = window.location.href;
        return ((pathname.indexOf("/login") !== -1) ||
        ((this.authService.role === 'user') && (pathname.indexOf("/user") !== -1)) ||
        ((this.authService.role === 'user') && (pathname.indexOf("/finishTest") !== -1)) ||
        ((this.authService.role === 'user') && (pathname.indexOf("/showTests") !== -1)) ||
        ((this.authService.role === 'teacher') && (pathname.indexOf("/teacher") !== -1)) ||
        ((this.authService.role === 'admin') && (pathname.indexOf("/admin/assign_test") !== -1)) ||
        ((this.authService.role === 'admin') && (pathname.indexOf("/admin/teacher_info") !== -1)));
    }

    ngOnInit():any {
        $('#appPreloader').hide();
        this.routeChangeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationError) {
                console.log('Handled that!');
                this.router.navigate(['/login']);
                // TODO: (pay attention) : Just note for code that was here:
                // another subscriber with this.checkPath(); in content
                // - It's useless subscriber if its calls checkPath because of
                // changes of its value watch angular itself, no need to do useless call
                // state will not save.
            }
        });
    }

    ngOnDestroy():any {
        this.routeChangeSubscription.unsubscribe();
    }
}
