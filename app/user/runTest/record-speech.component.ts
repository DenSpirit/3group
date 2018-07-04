import {onError} from "@angular/upgrade/src/util";
import {Component, SimpleChanges, Input, OnChanges, OnDestroy} from "@angular/core";
import {$} from "jquery";

@Component({
    selector: 'speech-recorder',
    templateUrl: 'app/user/runTest/record-speech.html',
    directives: []
})

export class RecordSpeechComponent implements OnChanges, OnDestroy {

    socket:any;
    stream:any;
    recorder:any;
    startRecord:boolean = false;
    stopRecord:boolean = false;
    @Input() filename;

    ngOnChanges(changes:SimpleChanges):any {
        if (changes['filename']) {
            this.filename = changes['filename'].currentValue;
        }
    }

    ngOnDestroy() {
        this.closeAudio();
    }


    getUserMediaWrapper(session, successHandler, errorHandler) {
        (navigator['webkitGetUserMedia'] || navigator['mozGetUserMedia'] || navigator.getUserMedia ||
        navigator['msGetUserMedia']).call(navigator, session, successHandler, errorHandler);
    }

    recordAudio() {
        this.startRecord = true;

        this.socket = new WebSocket('ws://localhost:2016');
        let session = {
            audio: true,
            video: false
        };
        let that = this;
        this.socket.onopen = function (event) {
            //console.log('this.filename this.socket.onopen' + that.filename);
            that.socket.send(that.filename);  //send fileName(Maxim)
        };

        this.getUserMediaWrapper(session, ((s) => that.initializeRecorder(s)), onError);

    }

    initializeRecorder(stream) {
        this.stream = stream;
        let context = new AudioContext();
        let audioInput = context.createMediaStreamSource(stream);
        let bufferSize = 2048;
        this.recorder = context.createScriptProcessor(bufferSize, 5, 2);
        let that = this;
        this.recorder.onaudioprocess = ((e) => that.recorderProcess(e));
        audioInput.connect(this.recorder);
        this.recorder.connect(context.destination);
    }


    recorderProcess(e) {
        let left = e.inputBuffer.getChannelData(0);
        console.log('a');
        this.socket.send(this.convertFloat32ToInt16(left));
    }

    convertFloat32ToInt16(buffer) {
        let l = buffer.length;
        let buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf;
    }

    closeAudio() {
        this.stopRecord = true;
        if (this.recorder !== undefined) {
            this.recorder.disconnect();
            this.recorder = undefined;
        }
        if (this.stream !== undefined) {
            this.stream.getAudioTracks().forEach((track) => track.stop());
            this.stream = undefined;
        }
        if (this.socket !== undefined) {
            this.socket.close();
            this.socket = undefined;
        }
    }
}
