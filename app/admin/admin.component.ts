import {Component, NgZone} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {MaterializeDirective} from "angular2-materialize";
import {AddMemberComponent} from "./actions/add-member/add-member.component";
import {NotificationsComponent} from "./actions/notifications/notifications.component";
import {AddQuestionComponent} from "./actions/add-question/add-question.component";
import {ShowUsersComponent} from "./actions/show-users/show-users.component";
import {NotificationActive} from "./actions/notifications/notification.active.class";

@Component({
    selector: 'admin-component',
    templateUrl: 'app/admin/admin.home.html',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective, ShowUsersComponent, AddMemberComponent, NotificationsComponent, AddQuestionComponent]
})

export class AdminComponent {
    currentTab:number;
    currentWidth:number;

    currentNotification;

    constructor(ngZone:NgZone) {
        this.currentTab = 2;
        this.currentWidth = window.innerWidth;

        window.onresize = () => {
            ngZone.run(() => {
                this.currentWidth = window.innerWidth;
            });
        };
    }

    changeTab(currentTab) {
        this.currentTab = currentTab;
    }

    onNotificationReceived(responce):void {
        if (!responce) {
            return;
        }
        this.currentNotification = responce;
    }

    onDeclineNotification() {
        this.currentNotification = new NotificationActive(this.currentNotification, 'decline');
    }

    onAssignNotification() {
        this.currentNotification = new NotificationActive(this.currentNotification, 'assign');
    }
}