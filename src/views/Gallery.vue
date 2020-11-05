<template>
    <div>
        <b-card>
            <b-card-body id="gallery-body">
                Gallery
                <div v-for="foldername in foldersArr" :key="foldername.id">
                    <div class="items"  @click="displayFolder(foldername)">
                        <img src="https://www.vectorico.com/download/office/folder-icon.png" width="120" height="120">
                        <p class="name">{{foldername}}</p>
                    </div>
                </div>
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
        </b-card>
        <Videos class="makevideo"/>
    </div>
</template>

<script>
import Vue from "vue"
import firebase from "firebase"
import { users, videos } from "../firebase";
import Videos from "./Videos"

export default {
    name: "Gallery",
    data() {
        return {
            foldername: "",
            filename: "",
            fileurl: "",
            foldersArr: [],
            filesArr: [],
            folder: "",
            imageExtension: ["png","jpg","jpeg","bmp","gif","tif","tiff","eps","raw","cr2","nef","orf","sr2"],
            imgvideo: 0
        }
    },
    components: { Videos },
    mounted() {
       this.deployFolder(); 
    },
    methods: {
        deployFolder() {
            let vm = this;
            videos.on("value", snap => {
                vm.foldersArr = [];
                vm.filesArr =[];
                let value = snap.val();
                for (let key in value) {
                    if (vm.foldersArr.indexOf(value[key]["foldername"]) == -1 && value[key]["foldername"] != "") {
                        vm.foldersArr.push(value[key]["foldername"]);
                    }
                    if (value[key]["foldername"] == "") {
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
        },
        displayFolder(folder) {
            this.$router.push({ name: 'Folders', params: { id: folder }});
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
