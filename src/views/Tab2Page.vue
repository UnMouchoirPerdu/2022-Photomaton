<template>
  <ion-page>
    <ion-header>
      <ion-toolbar style="background: white">
        <ion-back-button slot="start" text="Annuler"></ion-back-button>
        <ion-title>{{ this.prenom + " " + this.nom }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false" class="preview" style="--background: transparent!important; --overflow: hidden">
      <div id="cameraPreview" class="cameraPreview" style="text-align: center;">
      </div>
      <ion-img :src="self_img"></ion-img>
      <ion-fab vertical="center" horizontal="end" slot="fixed" :hidden="photoStuffHidden">
        <ion-fab-button @click="takeSavePhoto()" color="light" translucent style="height: 70px; width: 70px">
          <ion-icon :icon="ellipseOutline" color="medium" style="font-size: 72px"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-fab vertical="bottom" horizontal="start" slot="fixed" :hidden="!photoStuffHidden">
        <ion-fab-button @click="retakePhoto()" color="danger" style="height: 70px; width: 70px">
          <ion-icon :icon="refreshOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" :hidden="!photoStuffHidden">
        <ion-fab-button @click="confirmPhoto()" color="success" style="height: 70px; width: 70px">
          <ion-icon :icon="checkmarkOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonFab,
  alertController,
  IonBackButton,
  IonImg,
  IonButton
} from '@ionic/vue';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions} from '@capacitor-community/camera-preview';
import {ellipseOutline, refreshOutline, checkmarkOutline} from "ionicons/icons";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import router from '@/router';
import { Media } from '@capacitor-community/media';
import { NativeBiometric } from "capacitor-native-biometric";

document.body.style.backgroundColor = "transparent !important"

export default defineComponent({
  name: 'Tab2Page',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonFabButton, IonIcon, IonFab, IonBackButton, IonImg},
  setup() {
    return {
      ellipseOutline,
      refreshOutline,
      checkmarkOutline
    }
  },
  data(){
    return {
      prenom: 'Prenom',
      nom: 'Nom',
      self_img: null,
      photoStuffHidden: false,
      photoSave: null
    }
  },
  ionViewDidEnter() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'front',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      disableAudio: true,
      toBack: true,
      enableHighResolution: true,
      enableZoom: true
    };
    CameraPreview.start(cameraPreviewOptions);
    this.prenom = this.$route.query._prenom.toString()
    this.nom = this.$route.query._nom.toString()

    if (this.prenom == 'Prenom' || this.nom == 'Nom' || this.prenom == "" || this.nom == "") {
      this.alertNoEnter()
    }
  },
  ionViewDidLeave() {
    CameraPreview.stop()
  },
  methods: {
    async takeSavePhoto() {
      /*const CameraPreviewPictureOptions: CameraPreviewPictureOptions = {
        quality: 100
      };*/
      const pictureOpts: CameraPreviewPictureOptions = {
        width: 1280,
        height: 1280,
        quality: 85,
      };
      const result = await CameraPreview.capture(pictureOpts);
      const base64PictureData = result.value;
      const fileName = this.nom + '_' + this.prenom + '.jpeg';

      const photoTemp = await Filesystem.writeFile({
        directory: Directory.Cache,
        path: fileName.toString(),
        data: base64PictureData.toString()
      })
      /*
      await Media.savePhoto({
        path: photoTemp.uri,
        album: {
          name: 'Divtec'
        }
      })*/
      this.photoSave = photoTemp
      this.self_img = "data:image/jpeg;base64,"+base64PictureData;
      this.photoStuffHidden = true;
      await CameraPreview.stop();
    },
    retakePhoto() {
      const cameraPreviewOptions: CameraPreviewOptions = {
        position: 'front',
        parent: 'cameraPreview',
        className: 'cameraPreview',
        disableAudio: true,
        toBack: true,
        enableHighResolution: true,
        enableZoom: true
      };
      this.photoStuffHidden = false;
      this.self_img = null;
      CameraPreview.start(cameraPreviewOptions)
    },
    confirmPhoto() {
      NativeBiometric.verifyIdentity({
        reason: "Vérification du superviseur",
        title: "Vérification"
      }).then(
          () => {
            Media.savePhoto({
              path: this.photoSave.uri,
              album: {
                name: 'Divtec'
              }
            })
            router.push({path:'/tabs/tab3', query:{ isSaved: 'true' }})
          },
          (error) => {
            console.log('feur')
          }
      );

    },
    async alertNoEnter() {
      const alert = await alertController
          .create({
            header: 'Erreur',
            message: 'Veuillez choisir ou créer un profil valable.',
            buttons: [
              {
                text: 'OK',
                role: 'ok',
                handler: () => {
                  router.push('/tabs/tab1')
                },
              },
            ],
          });
      return alert.present();
    }
  }
});
</script>

<style>
ion-content {
  background-color: transparent;
}

ion-fab-button {
  --ion-background-color: #ffffff;
}
</style>
