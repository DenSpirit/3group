import {Injectable} from "@angular/core";
import {CustomHttp} from "../../../common/services/CustomHttp";
import {Observable} from "rxjs/Rx";
import {NotificationActive} from "./notification.active.class";
import {Notification} from "./notifications.class";

@Injectable()
export class NotificationsService {
    constructor(private customHttp:CustomHttp) {

    }

    getData():any {
        return Observable.timer(0, 3000)
            .flatMap(() => {
                return this.customHttp.get('/admin/notifications')
            });
    }

    declineNotification(notification:NotificationActive):any {
        return this.customHttp.post('/admin/decline_request_notification', this.prepareDeclineNotification(notification));
    }

    deleteNotification(notification:Notification):any {
        return this.customHttp.post('/admin/done_notification', this.prepareDoneNotification(notification));
    }

    private prepareDeclineNotification(notification:NotificationActive) {
        return {'notificationId': notification.notificationId, 'testId': notification.testId};
    }

    private prepareDoneNotification(notification:Notification) {
        return {'notificationId': notification.notificationId};
    }
}