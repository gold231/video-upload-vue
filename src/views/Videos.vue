<template>    
    <b-card class="col-xl-5">
        <b-card-body>
            <b-input-group class="mb-2">
                <b-input-group-prepend is-text><b-icon icon="folder"></b-icon></b-input-group-prepend>
                <b-form-input type="text" :placeholder="'Make a new Folder...'" v-model="foldername"></b-form-input>
            </b-input-group>
            <b-button @click="makefolder">Make</b-button>
            <b-form-file
                class="mb-2"
                placeholder="Choose a photo here..."
                v-model = "file"
            ></b-form-file>
            <b-spinner
                label="Spinning"
                v-if="spinning == true"
            ></b-spinner>
            <b-button @click="uploadFile">Upload</b-button>
        </b-card-body>
    </b-card>
</template>
<script>
import Vue from "vue"
import firebase from "firebase"
import { users, videos } from "../firebase";

export default {
    name: "Videos",
    data() {
        return{
            spinning: false,
            foldername: "",
            filename: "",
            fileurl: "",
            videosArr: [],
            file: null            
        }
    },
    components: {},
    mounted() {},    
    methods: {
        videosInit() {
            this.foldername = "";
            this.filename = "";
            this.fileurl ="";
            this.videosArr = [];
        },
        uploadFile() {
            this.spinning = true;
            // firebase.storage().ref().child("image/Rating.png").delete();
            var vm = this;
            const file = this.file;
            const storageRef = firebase
                .storage()
                .ref(`${file.name}`)
                .put(file);
            storageRef.on(
                `state_changed`,
                snapshot => {
                    this.uploadValue =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                error => {
                    console.log(error.message);
                },
                () => {
                    this.uploadValue = 100;
                    storageRef.snapshot.ref.getDownloadURL().then(url => {
                        vm.fileurl = url;
                        vm.spinning = false;
                        let data = {
                            foldername: vm.foldername,
                            filename: `${file.name}`,
                            fileurl: vm.fileurl
                        }
                        videos.push(data);
                        vm.videosInit();
                        // console.log(vm.fileurl);
                    });
                }
            );
        },
        makefolder() {
            // alert(this.foldername);
            let data = {
                foldername: this.foldername,
                filename: "",
                fileurl: ""
            }
            videos.push(data);
            this.videosInit();
        }
    }
}
</script>