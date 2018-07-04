import {Component, OnInit, OnDestroy} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {MaterializeDirective} from "angular2-materialize";
import {InfiniteScroll} from "angular2-infinite-scroll";
import {CustomHttp} from "../../../common/services/CustomHttp";
import {StateService} from "./StateService";
import {$} from "jquery";

@Component({
    selector: 'show-users-component',
    templateUrl: 'app/admin/actions/show-users/show-users.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective, InfiniteScroll],
    providers: [CustomHttp, StateService]
})

export class ShowUsersComponent implements OnInit, OnDestroy {

    private searchFilter:string;
    private isThereDataToScroll:boolean;
    userList = [];
    shownUsers = 0;

    constructor(private customHttp:CustomHttp,
                private router:Router) {
    }

    getUsers() {
        this.customHttp.post('/admin/user_list', {n: this.shownUsers, searchFilter: this.searchFilter})
            .subscribe(response => {
                console.log('posted');
                this.setUserList(response);
            });
    }

    setUserList(response) {
        this.isThereDataToScroll = response.length !== 0;
        this.userList = this.userList.concat(response);
        for (let i = 0; i < this.userList.length; i++) {
            if(this.userList[i].role === 'user'){
                this.userList[i].chipColor = 'light-green lighten-3';
            } else if(this.userList[i].role === 'admin') {
                this.userList[i].chipColor = 'deep-purple lighten-4';
            } else if(this.userList[i].role === 'guest') {
                this.userList[i].chipColor = 'lime accent-1';
            } else {
                this.userList[i].chipColor = 'cyan lighten-4';
            }
        }
        console.log(this.userList);
        $(document).scrollTop(StateService.scrollPosition);
    }

    renewUserList(response) {
        this.isThereDataToScroll = response.length !== 0;
        this.userList = response;
        console.log(this.userList);
    }

    onScrollDown() {
        console.log('scrolled down!!');
        this.shownUsers += 10;
        this.getUsers();
        StateService.scrollPosition = $(document).scrollTop();
    }

    applySearch() {
        console.log(this.searchFilter);
        this.customHttp.post('/admin/user_list', {n: this.shownUsers, searchFilter: this.searchFilter})
            .subscribe(response => {
                console.log('search posted');
                console.log(response);
                this.renewUserList(response);
            });
        this.shownUsers = 0;
    }

    showDetails(user) {
        StateService.scrollPosition = $(document).scrollTop().valueOf();
        if (user.role === 'user') {
            this.router.navigate(['/admin/assign_test', user.id]);
        } else if (user.role === 'teacher') {
            this.router.navigate(['/admin/teacher_info', user.id]);
        } else if (user.role === 'guest') {
            this.router.navigate(['/admin/guest_info', user.id]);
        }
    }

    ngOnInit() {
        console.log(StateService.searchFilter);
        this.searchFilter = StateService.searchFilter;
        console.log(this.searchFilter);
        if (StateService.fromDetail == true) {
            this.searchFilter = StateService.searchFilter;
            StateService.fromDetail = false;
        } else {
            this.searchFilter = '';
        }
        console.log('initialized');
        this.getUsers();
    }

    ngOnDestroy() {
        StateService.searchFilter = this.searchFilter;
    }
}
