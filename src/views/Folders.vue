<template>    
    <div>
        Folders
        <b-card-body id="gallery-body">
            <div v-for="file in filesArr" :key="file.id">
                <div class="items" v-if="file.imgvideo">
                    <a target="blank" :href="file.fileurl">
                        <img src="https://img.icons8.com/plasticine/2x/image.png" width="120" height="120">
                        <p class="name">{{file.filename}}</p>
                    </a>
                </div>
                <div class="items" v-else>
                    <a target="blank" :href="file.fileurl">
                        <img src="https://purepng.com/public/uploads/large/purepng.com-video-icon-galaxy-s6symbolsiconssamsungapp-iconsgalaxy-s6-icons-721522597480axbjz.png" width="120" height="120">
                        <p class="name">{{file.filename}}</p>
                    </a>
                </div>
            </div>
        </b-card-body>
        <b-card class="col-xl-5">
            <b-card-body>                
                <!-- <b-input-group class="mb-2">
                    <b-input-group-prepend is-text><b-icon icon="folder"></b-icon></b-input-group-prepend>
                    <b-form-input type="text" :placeholder="'Make a new Folder...'" v-model="foldername"></b-form-input>
                </b-input-group>
                <b-button @click="makefolder">Make</b-button> -->
                <b-form-file
                    class="mb-2"
                    placeholder="Choose a photo here..."
                    drop-placeholder="Drop file here..."
                    ref=""
                    v-model = "file"
                ></b-form-file>
                <b-spinner
                    label="Spinning"
                    v-if="spinning == true"
                ></b-spinner>
                <b-button @click="uploadFile">Upload</b-button>
            </b-card-body>
        </b-card>
    </div>
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
            file: null,
            filesArr: [],
            imageExtension: ["png","jpg","jpeg","bmp","gif","tif","tiff","eps","raw","cr2","nef","orf","sr2"],
            imgvideo: 0
        }
    },
    components: {},
    mounted() {
        this.deployFolder(); 
    },    
    methods: {
        videosInit() {
            this.foldername = "";
            this.filename = "";
            this.fileurl ="";
        },
        uploadFile() {
            this.spinning = true;
            // firebase.storage().ref().child("image/Rating.png").delete();
            var vm = this;
            const file = this.file;
            const storageRef = firebase
                .storage()
                .ref(`${this.$route.params.id}/${file.name}`)
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
                            foldername: vm.$route.params.id,
                            filename: `${file.name}`,
                            fileurl: vm.fileurl
                        }
                        videos.push(data);
                        vm.videosInit();
                    });
                }
            );
        },
        deployFolder() {
            let vm = this;
            videos.on("value", snap => {
                vm.filesArr =[];
                let value = snap.val();
                for (let key in value) {
                    // if (vm.foldersArr.indexOf(value[key]["foldername"]) == -1 && value[key]["foldername"] != "") {
                    //     vm.foldersArr.push(value[key]["foldername"]);
                    // }
                    if (value[key]["foldername"] == vm.$route.params.id & value[key]["filename"] != "") {
                        let videoORimage = value[key]["filename"].split(".");
                        let extension = videoORimage[videoORimage.length - 1];
                        let imgvideo = 0;
                        for (let i=0; i<this.imageExtension.length; i++) {
                            imgvideo |= (extension == this.imageExtension[i]);
                        }
                        // console.log(imgvideo);
                        vm.filesArr.push({
                            filename: value[key]["filename"],
                            fileurl: value[key]["fileurl"],
                            imgvideo: imgvideo
                        });
                    }
                }
            })   
        }
    }
}
</script>
<style lang="scss" scoped>
    .items {
        float:left; 
        margin:10px;
    }
    .name {
        display: block; 
        width: 120px; 
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis;
    }
    .makevideo {
        float:none;
        border: none;        
    }
    @media (min-width: 1200px) {
        .makevideo {
            margin-left: 29%;
        }
    }
</style>